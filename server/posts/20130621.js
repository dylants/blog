import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Continuous Integration with Jenkins and Node.js';
const TIMESTAMP = '20130621';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130621/jenkins_node.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>
      A while ago, I wrote about how you can use <a href="/posts/20130321/using-travis-continuous-integration-for-your-open-source-project">Travis-CI for your open source project</a>.  And while that works great for open source projects, it's not nearly as <em>free</em> for private repositories as it is for public ones.  So if you have a private GitHub repo, or are using GitHub enterprise at a company, what are you to do?  You could pay for the use of Travis-CI (which I'm sure would be great if you have the option), but if not, there's always <a href="http://jenkins-ci.org/">Jenkins</a>.
      </p>

      <p>
      Jenkins is an open source continuous integration platform, built in Java, and primarily used by the Java community.  Surprisingly (as of this writing) there's not that many options out there for the Node community.  I've mentioned <a href="https://travis-ci.org/">Travis</a>, but with the huge focus on testing recently you'd think there'd be more open source options for continuous integration of JavaScript projects.  Until we get there, Jenkins does provide a solution, though it's not the simplest.  I recently had to setup Jenkins to run our <a href="http://visionmedia.github.io/mocha/">Mocha</a> tests in Node, and thought it would be best to document what I've done.
      </p>

      <h2>Install Jenkins</h2>

      <p>
      If you don't already have a running Jenkins server available, it's pretty easy to get one up and going.  We use Amazon Web Services, so I created an Ubuntu instance and installed it there.  There are a ton of <a href="http://jenkins-ci.org/">native distributions of Jenkins on their site</a>, or you can always just download the war file and run it with Java directly. <a href="https://wiki.jenkins-ci.org/display/JENKINS/Meet+Jenkins">The installation instructions on the Jenkins website</a> will guide you through this part.
      </p>

      <h2>Install Node</h2>

      <p>
      Now this may seem silly, but I ran into all sorts of PATH problems using Node with <a href="https://github.com/creationix/nvm">NVM</a> on the remote Jenkins server.  Jenkins usually runs as a service, and if you have a dynamic PATH for Node, this just leads to frustration.  In the end, I installed Node straight from the package manager, into /usr/local/bin.
      </p>

      <h2>Does Mocha speak Jenkins?</h2>

      <p>
      So Jenkins doesn't understand the Node environment, nor really any environments outside of Java/Maven/Ant.  Much of the advice online is to use some crazy Maven or Ant script to wrap your Node tests, and I'd really like to avoid that at all costs.  Luckily, <a href="http://visionmedia.github.io/mocha/#reporters">Mocha comes with a ton of reporters</a>, and the XUnit reporter matches up with JUnit almost exactly.  By using this reporter, we can create reports that Jenkins can then read in, and display for us in our continuous integration builds.
      </p>

      <p>
      Using this XUnit reporter, you'll need to store the output in an XML file for Jenkins to read in later.  I prefer to use npm to execute my tests, so in my package.json is something similar to this:
      </p>

      <pre className="prettyprint">
{`"scripts": {
  "test": "./node_modules/.bin/mocha --recursive -R xunit test/ > test-reports.xml"
}
`}
      </pre>

      <p>
      This will execute Mocha (the executable will always be in node_modules if it's a dependency of your project) recursively on the "test/" directory, using the XUnit reporter, and store the output in a file named "test-reports.xml".
      </p>

      <h2>Add your Node project to Jenkins</h2>

      <p>
      Once you have Mocha all setup in your Node project, you can add the project to Jenkins.  There is a <a href="https://wiki.jenkins-ci.org/display/JENKINS/NodeJS+Plugin">Node.js plugin for Jenkins</a>, though that's really for executing code within Node during a build, not for running tests.  So it's not going to be helpful for us here.  Instead, create a "free-style" project within Jenkins, add the Git repo for your code, and scroll to the bottom.  Within the "Build" section, add a build step to execute shell (on Windows, execute batch).  Here's where we'll tell Jenkins how to build our project.  And because this is a Node project, and npm is configured to drive the tests, we want npm to install it's dependencies and execute the tests:
      </p>

      <img src="https://s3.amazonaws.com/dylants-blog/public/images/20130621/jenkins-build-execute_shell.png" alt="Jenkins build execute shell" />

      <p>
      The picture above shows that in the "Command" section we added "npm install" and "npm test" as two separate commands that should run on each build.  Jenkins will clone your Git repo, install the dependencies of your project, then execute your tests.  The results of those tests will be stored in a file named "test-reports.xml" (as you remember), and we'll need to tell Jenkins to include those in it's test report.
      </p>

      <p>
      Below the build section is "Post-build Actions".  Here, add a post-build action to publish a JUnit test result report.  Within the "Test report XMLs" field, add our "test-reports.xml" file:
      </p>

      <img src="https://s3.amazonaws.com/dylants-blog/public/images/20130621/jenkins-build-publish_junit_reports.png" alt="Jenkins build publish junit reports" />

      <h2>Build your Project</h2>

      <p>
      That's all of the configuration, now you can build your project and see the test results on the project page.  Keep in mind that because we chose to execute "npm test" in the shell command, if the tests fail, npm will return a 1 (or non-zero).  This will cause the shell command to fail, and Jenkins will interpret that to mean the build failed.  So when your tests fail, the build fails.  Is that a problem?  Probably not.  Just a difference between Java projects that are marked "unstable" when tests fail, rather than a failed build.
      </p>

      <p>
      Either way, what you're left with is <em>free</em> continuous integration on your private Git repository.  Yay!
      </p>

    </section>
  );
}
