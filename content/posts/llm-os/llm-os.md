---
title: "The Newest Operating System"
date: 2024-01-19T23:09:39-05:00
draft: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
---

If you have been using GPT-4, then you realize how much better it is than the free version. It's not just the model itself that got a lot smarter at answering requests but also the tooling developed around it, like searching the internet to get you up-to-date responses if needed, being able to take files and analyze them, running code and then analyzing the result, and using a calculator for things involving math. It's becoming just like a human would behave when trying to find an answer, just a lot faster. Of course, you have to pay USD $20/month to use it.

GPT-4 has been out for closer to a year, so a new model, GPT-5 or whatever it will be called, is likely to be released soon as such big models take an insane time and compute resource that companies only train such models once a year.

To give you an appreciation of how much time, effort, money, and compute these language models take to train, I will try to explain what it takes to produce a model like GPT-4.


 ## High-level training process for a model like GPT-4:

### First stage: pre-training (done once a year)

- Collect 100TB of internet data (low-quality data)
    - crawl the internet, Common Crawl
- Train a transformer (a type of neural network) on that data
    - likely need 60K GPUs or more (> USD $100m)
    - training takes months and there will be errors and issues trying to manage that many GPUs coherently
    - the goal of the transformer is to just be able to predict the next token
- Now you have a base model
    - a useless model as it does not understand instructions; it can only complete text.
- Do this stage once a year as it's expensive and time-consuming

Trying to use this base model will look something like this:

```
User: Who was the first president?

AI: The president of the United States is the head of state and head of government of the United States,....

```

So now you have a trained transformer that can only complete text. Continue training that model but this time, be very picky about the data you train it on.


### Second stage: fine-tuning (done every week)
- Collect 100k high-quality ideal Q&A responses
    - contract many experts in many fields to answer these questions correctly and with great precision
    - companies like scala.ai provide such data
- Continue training the base model from the first stage on this data
    - continue to train the weights of the transformer from stage one
    - takes a day to train
- Collect 1M high-quality ideal comparisons
    - a comparison is a question but with many qualifying answers (but one is usually the best)
    - contract many experts in many fields to select the best answer for a prompt
    - companies like scala.ai provide such data
- Train a reward model (RLHF model) on the 1M high-quality ideal comparisons collected
    - the algorithm is to predict which answer is the best
- Collect 100k prompts (no responses) and continue training the transformer model to predict the next token using the trained reward model to generate tokens that maximize the reward
- Now you have something like GPT-4
- Do this second stage every week




Most of the financial and engineering pain and time getting something like GPT-4 (99%) is spent on the first stage.

Obviously, GPT-4 can also take images as input, but how so if it's only trained on text data? When you input an image, there is another model that is trained to output a detailed caption for that image and then give that to GPT-4. This secret model is only able to take an image and output a caption of that image. It can't do what GPT-4 does, and it's a fairly cheap and simple model to train compared to GPT-4.

Well, GPT-4 can output images as well and how it does that is by using another secret small model that is only trained on taking a prompt and turning it into an image.

Well, GPT-4 is able to take and output audio as well. There is a secret small model trained to take in voice input and convert it to high-accuracy text; that text is then given to GPT-4 to process, and the output from GPT-4 is then read out loud.

Also, don't forget GPT-4 knows how to use a tool to search the internet when needed. It also knows how to use another tool that can run some code and return the result. These tools are cleverly built around GPT-4, so it all looks very seamless to you.

As you can see, this is resembling an operating system and not just 'a smart chat assistant.' The GPT-4 model is the most important part and the one that goes through this complex training process. It's the CPU of the OS, processing instructions and communicating with IO to carry out tasks. The fun part is not only will the core model get better, but the tools and how they are integrated with the model will too.



I got influenced by the idea of LLM OS first by non other than Andrej karpathy :-)

![whyyy](../image.png "a slide from Andrej karpathy")

[a slide from Andrej karpathy]




