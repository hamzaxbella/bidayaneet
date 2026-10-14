# Refactor UI Run 1 source task

https://app.notion.com/p/3f8dda2c05b280d39d7bc77d5376af71

## BidayaNeet App Portals & Modules
### How to read this document :
This document includes UI visual refactor instructions, you will find Portal name \> Modules \> pages under module. and under each page you will find a checkbox that includes the Instruction to be exeuted and the screenshot evidence.
share information across agents who are working on different Portals at real time. <br>You as the Orchestrator agent must plan the whole work first then deligate to each agent it’s work.
4 agents each one working on different portal.
agents must be 6.1 sol high. install shadcn and shadcn skill and load all necessary compoennts to be used in the refactor but not changing all the current ai to shadcn only specific new parts that you will plan based on what you see pretinent.
# Admin Portal
## Overview
#### Dashboard
- [ ] In @All pages layouts, the page content header background that contains the title and buttons and some metadata is currently a single croped rectangle that has sharp edges and only covers the header. i want it to be a container that covers the whole page content and has the same rounded corners as the side bar so have a visual consistency.
![](notion-file-block://3f8dda2c-05b2-803c-a526-c60f0490c4ac/14a8c6ba-b896-4753-803c-16c43bad8a2c?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
- [ ] Top blockers card ( view all ) must open a simple well design popup that shows full list of top blockers with a background blur effect ( install & use shadcn for this component behaviour alongside it’s skill )  \[ same for **Recent NEET Profiles - Opportunities & Collaborating Programs - Mediator Activity - Retention Rates )  and all view all throughout the other modules & **
![](notion-file-block://3f9dda2c-05b2-80fe-ac39-c23de3ac8ee0/8bd2e4ec-12e1-432a-851d-36df3fe76a80?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
- [ ] Refactor the map card to use a real map API editable to show a heat map but strictly having the full map of politicaly moroccan geography without the Sahara Assumed state instead of this svg pseudo map.
![](notion-file-block://3f9dda2c-05b2-80ab-ad06-f740e573c4be/5b0f7818-6a56-46b2-a879-263adf282b24?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
- [ ] Refactor the cards of the partners logos to be like the following ( logo on the left, name & feild of interest in the right while being left text aligned. opportuities bigger bellow then the button with unified color across the cards. widen the cards witdth and unifiy their height ( using justify align ) )
![](notion-file-block://3f9dda2c-05b2-804c-8d57-da7217dc24cb/07b810a8-6e5a-425c-ae22-05e3702cf962?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
## Programs
#### Programs
- [ ] For programs cards update their designs to use better imagery. better more clearer and unified layout.
![](notion-file-block://3f9dda2c-05b2-8005-9d62-c0536e5c407f/3403bc01-0a39-4a38-b93a-9266775e4b31?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
- [ ] I want you to add a shadcn multistep form popup to add a programm.
- [ ] I want you to add a single programm page to see the programm info and maybe edit.
## People
#### NEETs
- [ ] filters, search & add neet buttons doesn’t work. make them functional and use shadcn for seach & filters UI components.
![](notion-file-block://3f9dda2c-05b2-80e7-b67b-c053b5a23888/3aa9a2f5-d932-45f2-8389-9efd13ae8e03?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
- [ ] There is already a neet pipeline & active blockers page in dashbaord page. use the same components so we don’t have inconsistent design implementation.
![](notion-file-block://3f9dda2c-05b2-8089-a446-c318102a4842/c83d4cca-ac67-4cdb-83d9-f90b9c36b5b9?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
- [ ] For this part, update the UI to use more modern icons library. update the design of the profile spotlight to be clearer visually. make the view all buttons work.
![](notion-file-block://3f9dda2c-05b2-8076-945f-c7b4f5666b3a/9ec507c0-b4d4-4472-a227-621cf4c6498a?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
#### Mediators
- [ ] I want you to add a shadcn multistep form popup to add a mediator.
## Opportunity Management
#### Opportunities
- [ ] I want you to add a shadcn multistep form popup to add an opportunity when clicking add opportunity page. .
#### Micro-actions
- [ ] I want you to add a shadcn multistep form popup to add a microaction  when clicking add opportunity page. .
- [ ] Make the callendar more interractive & dedicated single micro action profile popup with edit functioality use shadcn
## Monitoring & Reporting
#### Heatmap
- [ ] Use a real editable map. with full political moroccan map.
![](notion-file-block://3f9dda2c-05b2-8097-aad5-c33b084426aa/54c87149-26a2-4cc1-9a53-245ba6b56ae8?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
# Mediator Portal
- [ ] make all seach boxes, filters and action buttons working, using shadcn compoennts and elements for better consistency
## Micro-actions
#### Micro-actions
- [ ] fix the actions de terrain cards using shadcn alternative.
![](notion-file-block://3f9dda2c-05b2-80f8-b12d-c650c2e0ab61/43a3c765-ae30-41f1-8da1-0a46653e8fcd?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
## Communication
#### Messages
- [ ] messages container looks like iframe i want it to be the whole page. removing the page title on this one.
# NEET Portal
1. the whole Neet Portal must be Reverted into Arabic. with RTL UI & text support and the nav bar will be in the right and page content in the left. font gonan be cairo
## Overview
#### Dashboard
- [ ] clicking the notification bell must open a notification menu ( use shadcn )
![](notion-file-block://3f9dda2c-05b2-80fd-bf3a-ccf7fc93d4d7/f25621cb-4716-4afd-a291-20f91fee13fb?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
- [ ] Clicking shat maintenant should open a chatbot Interface on the right bottom that you can chat with with predifened set of messages and smooth gsap animation. ( install gsap & it’s skill before usage ) as well as an always accessible chat bottom right chatbot circlar button
- [ ] the quote section looks ugly, i prefer a full cart size image with the motivation quote more stylized.
![](notion-file-block://3f9dda2c-05b2-80aa-9d70-da0cb2c50fd5/98870507-cf07-45d6-b53b-9c215dee69e5?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
- [ ] Inspiring stories UI must be like Short social media content UI. with only 4 visible at a time and bigger size.
![](notion-file-block://3f9dda2c-05b2-80f3-ab9d-ff4b8932a7e6/a0fbeeeb-b4ba-4b78-a216-e25464e7e77d?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
- [ ] Fix mediator card UI. and fix the image profile to be circular not egg shaped.
![](notion-file-block://3f9dda2c-05b2-80cf-b2bd-fd2a809d3833/b9a9b671-b4b5-444c-bc5a-fa21fe27feca?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
## Opportunity Management
#### Opportunities
- [ ] Fix & refactor the design of this component. using shadcn and workign filters and search
![](notion-file-block://3f9dda2c-05b2-80b9-bddb-c8c563cd7c1a/80014643-385a-4010-889c-4a2e4e295755?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
## Communication
#### Messages
- [ ] the messages container looks like an ifrmae inside the page. i want the whole page itself to be a messager instead without the title of the page in this one
![](notion-file-block://3f9dda2c-05b2-8068-a243-c7f319322759/2884f4be-b104-430b-9ed1-ce2b7a6030d3?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
# Partner Portal
- [ ] The Auth pages are Terribely designed. you must redesign them perfectly using a png trapsparent background logo better contrast less unecessary comments and texsts. and better generated imagery. refer to [dribble.com](http://dribble.com) for auth pages inspiration for all portals
![](notion-file-block://3f9dda2c-05b2-8098-ade5-d2ee6104616a/75bc35f0-bf14-4825-9ae0-e1bc75d6103d?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
## Overview
#### Dashboard
- [ ] This Section doesn’t really go along with the design system of the plateform it’s out of design context. refactor it’s UI.
![](notion-file-block://3f9dda2c-05b2-8081-bf86-c2e70730470e/eac54a2d-60ca-4831-aef9-16d59d42314a?space_id=2fc319ee-f6f2-4f3c-8d47-fae448b805c4&name=image.png)
<empty-block/>
