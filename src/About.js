import Box from "@mui/material/Box";

const About = () => (
  <Box>
    <h1>UmaStitcher!</h1>

    <p>
      This is a completely serverless screenshot stitcher for Umamusume.
      Inspired by ssc.kitachan.black stitching tool which is gone to this date.
    </p>

    <h2>FAQ</h2>

    <h3>I'm having issues getting a good result.</h3>

    <h4>There might be issues depending on:</h4>

    <ul>
      <li>
        <strong>Overlapping regions:</strong> you might have taken screenshots
        that only have a fairly small region in common. Try retaking with one
        more intermediate screenshot as a possible fix.
      </li>
      <li>
        <strong>Screenshot order:</strong> the screenshots are not in correct
        order. Try changing the order with helping buttons like the reverse one
        before stitching.
      </li>
      <li>
        <strong>Screenshot quality:</strong> your screenshots might be of too
        small resolution, too blurry or taken with a specific color filter that
        makes any detection operation harder. Make sure you have a decent device
        with a decent screen resolution for this tool.
      </li>
      <li>
        <strong>Screenshot dimensions:</strong> as a general example, if you
        took screenshots using a PC and trimmed them by hand, there would be
        issues in detecting the right coordinates from these images. Make sure
        all your screenshots are made with the same way and with the same
        dimensions.
      </li>
      <li>
        <strong>Device:</strong> we have a ton of different devices in use
        today, ranging from foldable small phones to huge tablets. Some of them
        are brand new and some are left in the prehistoric world. Behavior can
        be different from one device to another, so make sure you have a decent
        one with the latest updates.
      </li>
    </ul>

    <h4>For people who want to understand how this works:</h4>

    <p>
      Simply said, the program detects the bottom frame from the UI screenshots
      by finding the gray-ish background color, takes a small region of the
      bottom part (which is about 10% of the bottom frame height) and tries to
      find that same region in the next screenshots.
    </p>

    <p>
      Once the matching parts are found, the coordinates are sent to a cropping
      function. Once the base images are cropped, they finally get stitched
      together.
    </p>

    <p>
      So make sure you leave some clearly visible overlapping skills/genes/wins
      etc between your screenshots, and don't use any color filter since the
      bottom frames won't be identified anymore by their base color (which is
      supposed to be <code>#F2F2F2</code>).
    </p>

    <h4>Please be aware:</h4>

    <p>
      This application is a small project made by an average dev whose first
      occupation is to make web sites &amp; apps and not image manipulation
      stuff at all. So any extremely specific issue might probably not be my cup
      of tea.
    </p>

    <h3>What do you mean by "serverless"?</h3>

    <p>
      This project has been built with the idea of getting a standalone tool
      that doesn't require any backend operating server to compute image
      manipulation tasks.
    </p>

    <p>
      This also allows me to host this service without paying a single dime,
      since{" "}
      <a href="https://surge.sh" target="_blank" rel="noreferrer">
        surge.sh
      </a>{" "}
      allows the hosting of static web projects for free.
    </p>

    <p>
      No server, a free static web platform, so no ads nor donations needed to
      run this.
    </p>

    <h3>Is this a copy of the "inspired" tool?</h3>

    <p>
      Sincerely said, no.
      <br />
      After shutting down their service, the devs of the kitachan black tool
      released some Python code that allowed anyone to run their program on
      their own. But these came with some issues for this project:
    </p>

    <ul>
      <li>
        The Python program itself was based on OpenCV, a well-known computer
        vision library that makes advanced image computing a lot, lot easier.
        But its implementation in pure JavaScript was too heavy to load (= more
        waiting time to use the tool, which is not pretty) and also said to have
        some performance flaws. No stable &amp; fast OpenCV for JS, so no real
        interest in copying the Python program for this project.
      </li>
      <li>
        The used functions in the Python program included some operations which
        would be useful in photography manipulation, but could be a bit too
        overkill for stitching some flat 2D UI screenshots. I decided to write
        the pipeline myself to make some of the computation lighter. This
        doesn't mean my program is performing better than using a huge and
        widely maintained library though. I'm pretty sure there are better ways
        to optimize this, and any suggestions are welcomed.
      </li>
      <li>
        In case you don't have the context yet, the kitachan black tool got
        voluntarily taken down by its owner, following a code stealing incident
        by a widely known Japanese game guide company. To be as fair as possible
        on this matter, I decided not to import/transpose anything from the
        published Python code.
      </li>
      <li>
        UmaStitcher will still be marked as "inspired" by the shut-down one,
        since the base concept still relies on how the previous tool worked.
      </li>
    </ul>

    <h3>FFS, your tool is unusable! Please fix it!</h3>

    <p>
      This is a simple project I made on my free time since I really wanted a
      working screenshot stitcher back online. If there's any major issues, I
      could take a look at it, but I won't promise anything about any patches or
      updates. Let me live.
    </p>

    <p>
      As a reminder, this is a serverless tool; so all the computation work will
      be done on your device. If you have a potato phone from 10 years ago or a
      weird device you got from a shady brand, don't expect this to work.
    </p>

    <h3>How can I contact you directly?</h3>

    <p>
      Don't - just use the issues tab if you absolutely need anything. But
      again, I might or might not look at it. However, if you really need to
      contact me for any professional subject, please send an email to{" "}
      <a href="mailto:poochtonic@gmail.com">poochtonic@gmail.com</a>. Thank you.
    </p>
  </Box>
);

export default About;
