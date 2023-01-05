---
title: "Typing Sensitive Info, Check The URL First?"
date: 2022-09-07T12:24:12-04:00
draft: false
ShowReadingTime: true
---

Most of you check the url before typing any sensitive info to guarantee that info will be sent to the website you intended to. There is [https://www.chase.com](https://www.chase.com/) and there is [https://www.chase.co/](https://www.chase.co/). You also check the padlock to insure the connection is encrypted so even if your internet traffic is being monitered, the data is encrypted so only you and chase.com know how to encrypt them. The middle man only knows you went to chase.com but doesn't know what you did there. This is also true for your ISP provider. 

Is there anything missing? I checked the URL and the padlock to the left of it exists, do I have the green light?

That is what I thought too. But look at this GIF I created of a working demo that answers the question above. The popup window is not a real browser window. If you interact with it enough, like moving it around, clicking the padlock sign to view more details, or clicking the url to change it, you will realize clicking the padlock sign or url section does nothing and the window is restricted to move only inside the webpage. A real popup window is just a normal chrome tap, but this one looks real,
how? It's just an embedded webpage (iframe) with styling around it to make it look like another real chrome window. 

This is just a demo I created by copying the "Sign in with Apple" button from the nytimes newspaper. 

{{< figure src="../bitb_fake.gif" title="Fake popup window sign in with apple" alt="Animation" >}}




The below GIF is a real example. Notice how the popup window has more functionality than the fake one above.


{{< figure src="../bitb_real.gif" title="Real popup window" alt="Animation" >}}


I did not discover this. It was first discovered [here](https://mrd0x.com/browser-in-the-browser-phishing-attack/). You should definitly check the article for more details and follow the instructions on how to create a demo yourself. Thanks mr.d0x for this elegant attack.

