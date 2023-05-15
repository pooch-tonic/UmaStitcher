# UmaStitcher!

A completely serverless screenshot stitcher for Umamusume. Inspired by ssc.kitachan.black stitching tool which is gone to this date.

## FAQ

### What do you mean by "serverless"?

This project has been built with the idea of getting a standalone tool that doesn't require any backend operating server to compute image manipulation tasks. This also allows me to host this service without paying a single dime, since [surge.sh](https://surge.sh) allows the hosting of static web projects for free. No server, a free static web platform, so no ads nor donations needed to run this.

### Is this a copy of the "inspired" tool?

Sincerely said, no.
After shutting down their service, the devs of the kitachan black tool released some Python code that allowed anyone to run their stitching program on their own. But these came with some issues for this project:

- The Python program itself was based on OpenCV, a well-known computer vision library that makes advanted image computing a lot, lot easier. But its implementation in pure javascript was too heavy to load (= more waiting time to use the tool, which is not pretty) and also said to have some performance flaws. No stable & fast OpenCV for js, no interest in using it, so I couldn't really make any use of the code itself.
- The used functions in the Python program included some operations which would be useful in photography manipulation, but could be a bit too overkill for stitching some flat 2D UI screenshots. I decided to write the pipeline myself to make some of the computation lighter. This doesn't mean my program is performing better than using a huge and widely maintained library though. I'm pretty sure there are better ways to optimize this, and any suggestions are welcomed.
- In case you don't have the context yet, the kitachan black tool got voluntarily taken down by its owner, following a code stealing incident by a widely known japanese game guide company. To be as fair as possible on this matter, I decided not to import/transpose anything from the published Python code.
- UmaStitcher will still be marked as "inspired" by the shut down one, since the program's base logic still relies on how the previous tool worked.

### I can't use your tool! Please fix it!

This is a simple project I made on my free time since I really wanted a working screenshot stitcher back online. If there's any major issues, I could take a look to it but I won't promise anything about any patches or updates. Let me live.
As a reminder, this is a serverless tool; so all the computation work will be done on your device. If you have a phone from 10 years ago, or a weird device you got from a shady brand, don't expect this to work.

### How can I contact you directly?

Don't - just use the issues tab if you absolutely need anything. But again, I might or might not look at it. However if you really need to contact me for any professional subject, please send a mail to [poochtonic@gmail.com](mailto:poochtonic@gmail.com). Thank you.
