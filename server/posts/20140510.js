import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Creating a Private npm Registry with Sinopia';
const TIMESTAMP = '20140510';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20140510/npm.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle title={TITLE} timestamp={DISPLAY_TIMESTAMP} />

      <p>
      Those who use Node.js at work will sooner or later run into the issue of internal packages.  Yes, you could keep all your internal code within a single project, or yes, you could reference your dependencies as GitHub repos in the <code>package.json</code> file, but neither are very elegant solutions.  Recommended alternatives for this include <a href="https://www.npmjs.org/doc/misc/npm-registry.html">cloning the entire npm repository</a>, or using a proxy, similar to that of <a href="https://www.npmjs.org/package/npm-delegate">npm-delegate</a> or <a href="https://github.com/krakenjs/kappa">Kappa</a>.  In addition, <a href="https://blog.nodejitsu.com/simple-hosted-private-npm-and-registry-nodejitsu-com/">some places will host private npm repositories for you</a>, while <a href="https://speakerdeck.com/seldo/nerdy-pontification-mealtime">npm is working on rolling out private modules</a>, and <a href="https://github.com/npm/npm/issues/5239">others are discussing how npm should handle namespaces</a>.
      </p>

      <p>
      With all of that in mind, I've found <a href="https://github.com/rlidwka/sinopia">Sinopia</a> to be one of the easiest solutions for this problem.  Sinopia does not require a <a href="https://couchdb.apache.org/">Couch Database</a>, nor much setup at all, and complies with the request/response syntax of npm.  Requests to Sinopia can proxy to registry.npmjs.org, and once packages are pulled down, they're stored locally on the file system.  But Sinopia also allows for internal packages, which are published privately and not accessible externally.
      </p>

      <h2>Install and Initial Configuration of Sinopia</h2>

      <a href="https://github.com/rlidwka/sinopia">Sinopia</a> is a node package (yes, that's meta), and therefore can be installed via npm as follows:

      <pre className="prettyprint">
{`$ npm install -g sinopia
`}
      </pre>

      <p>
      Once it's installed, I prefer to create a directory for Sinopia which contains the configuration file along with the node packages:
      </p>

      <pre className="prettyprint">
{`$ mkdir sinopia; cd sinopia
`}
      </pre>

      <p>
      From this new directory, start up Sinopia to build the initial configuration file, and soon the storage directory once packages have been published or pulled down.  For example, on initial startup in an empty directory, the output will resemble the following:
      </p>

      <pre className="prettyprint prettyprinted">
      <span className="pln">
{`$ sinopia
Config file doesn't exist, create a new one? (Y/n) Y
===========================================================
 Creating a new configuration file: "./config.yaml"

 If you want to setup npm to work with this registry,
 run following commands:

 $ npm set registry http://localhost:4873/
 $ npm set always-auth true
 $ npm adduser
   Username: admin
   Password: ZAsbOqhb8Pc
===========================================================
 warn  --- Server is listening on http://localhost:4873/
 `}
       </span></pre>

      <p>
      Here I think the output is a bit confusing from what has actually taken place, mostly based on the fact that the <code>npm adduser</code> command is very confusing.  At this point in your setup, Sinopia has created a basic <code>config.yaml</code> file, and within that file created a user <code>admin</code> with the password (specified in the output above) <code>ZAsbOqhb8Pc</code>.  However, your client side npm won't know about this, so you'll need to login (or "adduser").  So to summarize, the user has been "created" in Sinopia's registry, but you have yet to login as that user through npm (we'll do that later).
      </p>

      <p>
      If you were to look in that <code>config.yaml</code> file, you'd see the following:
      </p>

      <pre className="prettyprint">
{`# path to a directory with all packages
storage: ./storage

# a list of users
users:
  admin:
    # crypto.createHash('sha1').update(pass).digest('hex')
    password: 0b0ffed5aaa756c67949f8b2e4e59512ca39a695


...
`}
      </pre>

      <p>
      This specifies that the storage location is the local <code>storage</code> directory (note that the directory won't exist until the first node package is pulled down or pushed up).  It also specifies the single user <code>admin</code> with a password hash of <code>0b0ffed5aaa756c67949f8b2e4e59512ca39a695</code> (which is a hash of <code>ZAsbOqhb8Pc</code> generated from: <code>crypto.createHash('sha1').update(pass).digest('hex')</code>).  If you wish to change the password of a user, you'll need to run the password through the hash crypto code and paste the output in the configuration file.
      </p>

      <p>
      From here on when you start Sinopia from that same directory, it will startup and load in this configuration file.  Anytime a change is made to the configuration file, you'll need to restart Sinopia.
      </p>

      <h3>Change Sinopia Listen Address and Port</h3>

      <p>
      By default Sinopia will listen on <code>localhost</code> and port <code>4873</code>.  If your machine is hosting node packages for others outside of the local machine (quite likely), you'll need to change this to the hostname and port you'd like to expose.  So for instance if you have your machine running as <code>http://my-internal.npmjs.com</code> then you should add the following line to the configuration file:
      </p>

      <pre className="prettyprint prettyprinted">
      <span className="com"># you can specify listen address (or simply a port)</span><br />
      <span className="pln">listen: my-internal.npmjs.com:80</span>
      </pre>

      <h2>Configuring npm to use Sinopia</h2>

      <p>
      In npm's world, Sinopia is just another npm registry -- there is no difference in how it responds.  So from the client standpoint, you'll only need to point to this new registry instead of registry.npmjs.org.  To do this, run the command (replacing <code>localhost:4873</code> with the host and port running Sinopia):
      </p>

      <pre className="prettyprint prettyprinted">
      <span className="pln">$ npm set registry "http://localhost:4873/"</span>
      </pre>

      <p>
      You should see a .npmrc file created in your home directory with the following:
      </p>

      <pre className="prettyprint prettyprinted">
      <span className="pln">registry = http://localhost:4873/</span>
      </pre>

      <p>
      Now when you run any npm commands which should interact with the registry, you'll interact with your Sinopia instance.  Sinopia will by default proxy requests to registry.npmjs.org, so at this point all you've built is a proxy, but you can easily begin publishing private packages as well.
      </p>

      <h2>Publish a Private Package</h2>

      <p>
      Sinopia, like registry.npmjs.org, is setup with access restrictions.  The <code>admin</code> account that was created on initial setup can be used to login to Sinopia.  Run the following command, entering in the password that was presented during initial setup of Sinopia (for us, that was <code>ZAsbOqhb8Pc</code>):
      </p>

      <pre className="prettyprint prettyprinted">
      <span className="pln">
{`$ npm login
Username: admin
Password:
Email: (this IS public) myemail@domain.com
`}
      </span>
      </pre>

      <p>
      (Any email address can be used here, since there's not true tracking of email addresses done on the server side.)
      </p>

      <p>
      The .npmrc file will now contain the additional information to authorize you with the Sinopia server.  This will grant you publish access to Sinopia.
      </p>

      <h3>Prefixes</h3>

      <p>
      Before you publish your private package, I'd suggest setting up a prefix for all internal packages so that you can handle them correctly.  For example, if your company is named "IBM", I'd suggest prefixing all projects with "ibm-".  So if you were to create a package "awesome-module", you should instead call it "ibm-awesome-module".  (Collisions could occur with simple prefixes, so it's recommended you use a prefix that would be unlikely to collide with public packages).
      </p>

      <p>
      With the prefix all setup, inform Sinopia that projects which contain this prefix are internal only, and should not be proxied through registry.npmjs.org.  Inside the <code>config.yaml</code> file, update the <code>packages</code> section to the following:
      </p>

      <pre className="prettyprint">
{`packages:
  'ibm-*':
    # allow all users to read packages ('all' is a keyword)
    # this includes non-authenticated users
    allow_access: all

    # allow 'admin' to publish packages
    allow_publish: admin

    # no proxies, all request should be internal only

  '*':
    # allow all users to read packages ('all' is a keyword)
    # this includes non-authenticated users
    allow_access: all

    # don't allow anyone to publish
    allow_publish: none

    # if package is not available locally, proxy requests to 'npmjs' registry
    proxy: npmjs
`}
      </pre>

      <p>
      Packages that contain the <code>ibm-</code> prefix will now be handled differently from all other packages (<code>*</code>) within Sinopia.  The above code states that packages which contain the <code>ibm-</code> prefix can be read by anyone, but only published by the <code>admin</code> user.  Additionally, these packages will not include proxy requests to registry.npmjs.org, and instead be handled internally only.  All other packages will be proxied to registry.npmjs.org.  This configuration also does not allow anyone to publish packages that are not prefixed with <code>ibm-</code> (since these are considered "public" packages and should be pushed through registry.npmjs.org).  Though it's not required, it might be easier to restrict this way to avoid any problems down the road.
      </p>

      <p>
      Sinopia should be setup now to handle retrieving both public and private projects and publishing internal projects.  There's one last thing that should be done to avoid accidental publishing of internal projects externally.
      </p>

      <h3>Internal Project Configuration</h3>

      <p>
      Within the internal project source code, modify the <code>package.json</code> and add the <code>publishConfig</code> property to point to your Sinopia server (of course change to your specific host and port):
      </p>

      <pre className="prettyprint">
{`"publishConfig": {
    "registry": "http://localhost:4873/"
}
`}
      </pre>

      <p>
      This forces users who issue a <code>npm publish</code> command to publish to your Sinopia server rather than the external registry.npmjs.org.  The configuration in the .npmrc file should force communication through the Sinopia server, but if someone forgets to set all that up, this configuration won't allow them to publish externally. <a href="https://www.npmjs.org/doc/files/package.json.html">More information on the <code>publishConfig</code> configuration setting can be found here</a>.
      </p>

      <h3>Publish!</h3>

      <p>
      With all that done, issue the command to publish like you would normally:
      </p>

      <pre className="prettyprint">
{`$ npm publish
`}
      </pre>

      <p>
      You should see output specifying your Sinopia server address in the npm PUT commands on the client, and also see output on the Sinopia server console.  You can verify the package was pushed by viewing the storage directory on the Sinopia server.
      </p>
    </section>
  );
}
