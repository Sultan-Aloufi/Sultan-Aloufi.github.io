---
title: "Hooking Demystified"
date: 2022-12-19T16:19:32-05:00
draft: false
ShowReadingTime: true
ShowWordCount: true
---

I have an application that I want to alter its behavior slightly to work for my specific use case, but I don't have its source code. Can I alter its behavior while it's running? Yes, by a technique called Hooking. It works by intercepting function calls or messages passed between programs. The code that handles the interception is called a hook.

So here is my challenge, I've to explain to you how function hooking works without any detail compromise. This post can't be long and the non-programmer should make sense of most of it.

### Intro
#### Currently running program A can't view or modify running Program B's data for security reasons, why?
- Do you want your Call of Duty app that's running to also access and write to your Messaging app that you have open? No.
- Each program running must be able to run on the same machine hardware but they need to be isolated from each other for better security 
- This isolation mechanism is provided by your Operating System (iOS, Macos, Windows, Android, etc..)
- Your Call of Duty app might be running more than just one program simultanously (to do more than one thing at once for faster load and response time)
    - When opening the app, the main program runs and it can create other programs that will run indepedently 
    - These programs can't communicate or share data with each other, Oh no!
    - Your OS provides controlled mechanisms for these programs to talk and share data with each other if they need to. These mechanisms are called Inter-Process Communication (IPC)
    - Most OS's IPC mechanisms are similar to each other with minor differences in implementation

#### What are system calls?
- An operating system is just a program like all other programs on your computer. It's a huge complex program that has been maticslously desgined to be error reseliant and secure with full control over your computer to manage and share your computer's limited resources securly and fairly among other running programs. Thus when a program wants to print something to the screen, It can request it by calling a special function called a system call

- system calls are functions provided by your operating system that are when called, the following happens: 
    - 1. pause the program initiating the system call 
    - 2. do a context switch from user mode to kernel mode (sensitive mode allowing full control over the system without any permissions needed) 
    - 3. now the program transfered control to the kernel 
    - 4. service the request by performing the system call function (ex: open a file, print to screen, open a new program, connect to wifi)
    - 5. kernel returns the result of system call function performed and transfers control to the program by returning to user mode and continuing the program execution from where it was stopped  

### Two different Hooking techniques examples 
#### Hooking Example 1 (using Ptrace System call)
- Your Operating System provides the means to do so given the right permissions
    - The tracer program needs root permission to be allowed to control and insert the hook into another program (tracee)
    - If you are familiar with debuggers like gdb, this is how it controls other processes and view or modify their internal state
    - This method can be slow is it requires a lot of calls to ptrace to do anything and remeber ptrace is a system call so this can be slow when trying to modify large code of a big program
    - In linux based OS's, Ptrace is a powerfull system that allows full control of the tracee program
    - Ptrace is tricky to use as it requires intricate knowledge of the OS 

**inject.c program**
```
/* 
* Tracer program 
* Based on linux x86_64
*/

#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>
#include <sys/ptrace.h>
#include <sys/wait.h>
#include <sys/user.h>

int main(int argc, char *argv[])
{
    pid_t pid;
    long rip;

    if (argc < 3) {
        fprintf(stderr, "Usage: %s PID ADDRESS\n", argv[0]);
        return 1;
    }
    
    pid = atoi(argv[1]);
    void *isAllowedAddr = (void *) strtoul(argv[2], NULL, 16);

    // Attach to the target process
    if (ptrace(PTRACE_ATTACH, pid, NULL, NULL) < 0) {
        perror("ptrace(PTRACE_ATTACH)");
        return 1;
    }

    // Wait for the target process to stop
    waitpid(pid, NULL, WSTOPPED);

    // Save the original instruction at the breakpoint address
    long original_instruction = ptrace(PTRACE_PEEKDATA, pid, isAllowedAddr, NULL);
    
    // Set a breakpoint at the address of the isAllowed function
    ptrace(PTRACE_POKEDATA, pid, isAllowedAddr, (void *) (intptr_t) 0xCCCCCCCCCCCCCCCC);

    // Continue execution of the target process
    ptrace(PTRACE_CONT, pid, NULL, NULL);

    // Wait for the target process to stop
    waitpid(pid, NULL, WSTOPPED);

    // Restore the original instruction at the breakpoint address
    ptrace(PTRACE_POKEDATA, pid, isAllowedAddr, (void *) (intptr_t) original_instruction);
    
    // Get the value of the rip register
    struct user_regs_struct regs;
    ptrace(PTRACE_GETREGS, pid, NULL, &regs);
    rip = regs.rip;

    // Print the value of the rip register
    printf("rip = %lx, rdi = %d\n", rip, regs.rdi);
    
    // Modify the value of the rdi register (which holds the first function argument)
    regs.rdi = 0;

    // Write the changes to the registers of the target process
    ptrace(PTRACE_SETREGS, pid, NULL, &regs);

    // Continue execution of the target process
    ptrace(PTRACE_CONT, pid, NULL, NULL);

    // Detach from the target process
    ptrace(PTRACE_DETACH, pid, NULL, NULL);
    
    return 0;
}
```

**target.c program**
```
/*
* Target program
*/

#include <stdio.h>
#include <unistd.h>

int
isAllowed (int state)
{
  if(state == 0){
	  return 0;
  }
  else {
	  return 1; // not allowed
  }
}


int
main (int argc, char * argv[])
{

  int s = 1;

  printf ("isAllowed() is at %p\n", isAllowed);

  while (1)
  {
    if(isAllowed(s) == 0){
    	printf("Allowed! \n");
    }
    else{
    	printf("Sorry. \n");
    }

    s += 1;
    sleep (1);
  }

}
```
##### Compile and run #####
```
$ gcc -o inject inject.c -Wall
$ gcc -o target target.c -Wall
```

- In this demo of function hooking using Ptrace, assume the following:
    - You don't have the source code of target.c
    - Using a command line tool like *objdump*, you dissassemble the executable to assembly language, identify your target function to be *isAllowed* and know it's address during runtime
        - in this demo the address of isAllowed is given to you by the target program. This is unrealistic in real situations but Ptrace has full access to the target program memory and so I assume there is a way to find the address of isAllowed during runtime as it changes on every run of the target program. But knowing that Ptrace is complex, it will make the inject.c program too long and complex for the objective of this demo.  

Assume that *isAllowed* checks if you have permission before allowing you to do a certain critcial task. By default running the target program just prints *Sorry* indicating you don't have permission. By using ptrace and hooking to the target program during runtime we are able to modify the return value of our target function so *Allowed!* is printed. As you can see, Ptrace is powerful and useful but can be used maliciously as well, that all depends as running the inject program above requires root
privilage since it's using Ptrace. So becareful running programs as root especially those downloaded from the internet.         

{{< figure src="../ptrace_demo.gif" title="Ptrace demo run of the two programs above. left is target program, right is inject program" alt="Animation" >}}


#### Hooking Example 2 (Dynamic Library Injection) ####
This is a really popular and easier method. It's not just done on linux but also Windows as well. It's widely explained online by others in great detail. I might write a demo here from scratch but for now look at this github repo: https://github.com/kubo/plthook






