import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Java Logging: Creating, Indexing, and Monitoring';
const TIMESTAMP = '20130827';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130827/loggingindexingmonitoring.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>
      Most everyone who has developed an application is familiar with logging.  Creating log messages to debug potential problems of the future is a great way to make your life easier.  Figuring out how to effectively handle an ever-increasing log file, and more importantly, know when your customers encounter problems through those logs is a more difficult issue.  As a developer, monitoring your application can be something that does not come naturally, and instead pushed off to an operations team.  However, there are some very useful open source projects available to solve these problems, and wiring up your Java application to take advantage of them has become virtually effortless.
      </p>

      <p>
      I would break logging into three main phases: creating or writing the log entries from within your code, indexing and storing of those log messages, and monitoring all messages in a single merged view.  Each phase is really a knowledge base in itself, requiring an expert of sorts to navigate all the options and configurations available.  In this post, I'm outlining one possible option which I've found useful, using all open source tools.
      </p>

      <h2>Simple Logging Facade for Java (SLF4J)</h2>

      <p>
      We begin with creating log messages, and for that, the <a href="http://www.slf4j.org/">Simple Logging Facade for Java (or SLF4J)</a> provides a solid abstraction around writing log entries.  In the world of Java logging, many popular tools exist.  SLF4J tries to remove the burden of choosing one, by creating a facade you use to create log entries while binding that with an actual implementation which writes the entries to the log output.  There's <a href="http://www.slf4j.org/manual.html">a quick overview of the capabilities of SLF4J</a> which is a great place to start, and provides information on which implementations are available and how to incorporate them into your project. Below is an example of the code you would write to create a logger, and log a debug message:
      </p>

      <pre className="prettyprint">
{`// Creates the logger for our class
private final Logger logger = LoggerFactory.getLogger(getClass());

// ...

// Log our debug message, including the toString() of our object
logger.debug("write my object {} to the log!", myObj);
`}
      </pre>

      <p>
      The above logging statement logs a message which includes "myObj" converted to a String.  Note that the toString() method is only called on this object if the log level of that message is enabled.  So in this case, the toString() of "myObj" would only be called if "debug" logging is enabled.  This helps maintain an efficient performance level of your code base. <a href="http://www.slf4j.org/faq.html#logging_performance">More information on logging performance can be found in the SLF4J documentation</a>.
      </p>

      <h3>Log4J Configuration</h3>

      <p>
      SLF4J does not dictate that you should use one logging implementation over another, and supports a wide variety of bindings.  A binding is necessary however since without one log messages will not be created.  Therefore, in this example I've chosen <a href="http://logging.apache.org/log4j/1.2/">Log4J</a>, which is an Apache project and widely used in the Java community.
      </p>

      <p>
      Configuring your project to use the Log4J binding requires adding the Log4J jars to the classpath. Using <a href="https://maven.apache.org/">Maven</a>, this can be done by adding the following to your pom file, which adds both the SLF4J and Log4J dependency:
      </p>

      <pre className="prettyprint">
{`<!-- SLF4J with Log4J Binding -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.7.5</version>
</dependency>
`}
      </pre>

      <p>
      Log4J requires some configuration to output the log messages, and this configuration changes depending on how you choose to output your log messages.  For now, let's configure a simple console logger (later we'll add on a file logger).  The following should be entered into your log4j.properties file found in the src/main/resources directory of your project (meaning in the classpath):
      </p>

      <pre className="prettyprint">
{`# Direct log messages to stdout
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.Target=System.out
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%d{ABSOLUTE} %5p %50.50c:%4L - %m%n

# Root logger option
log4j.rootLogger=DEBUG, stdout
`}
      </pre>

      <p>
      With that configured, you should see debug level messages appear in your console window when the code paths are executed.  Easy, right?
      </p>

      <h2>Logstash + Elasticsearch</h2>

      <p>
      <a href="http://www.logstash.net/">Logstash</a> is an open source log management tool, providing you the ability to store logs in a manner suitable for searching.  There's a great <a href="http://www.youtube.com/watch?v=RuUFnog29M4">video provided by the creator of Logstash</a> on how it functions, but if that's too long, the <a href="http://www.logstash.net/docs/latest/tutorials/10-minute-walkthrough/">10 minute walkthrough</a> is recommended to understand the basics.  Really what we're getting out of Logstash is the ability to parse our existing logs (of any format) and store them in <a href="http://www.elasticsearch.org/">Elasticsearch</a>.
      </p>

      <p>
      Elasticsearch is an open source REST based search and analytics engine which <a href="http://www.elasticsearch.org/overview/">provides tools that allow you to understand your data in real-time</a>.  Once your data is contained within Elasticsearch, you can chart it out, view the data flow, search for specific items, or analyze for patterns.  There's a lot that can be done, and it's through the Logstash that we're able to integrate our data into Elasticsearch.
      </p>

      <p>
      Elasticsearch has a <a href="http://www.elasticsearch.org/overview/#installation">very simple installation</a>, but because of it's impressive capabilities, has a <a href="http://www.elasticsearch.org/guide/">more extensive guide</a> which can be daunting to review.  The use of Elasticsearch here though does not require an in depth understanding, but it might be worth your time to come back and review later.
      </p>

      <h3>Logstash + Elasticsearch Configuration</h3>

      <p>
      What we want to accomplish here is to have our messages from SLF4J/Log4J written to a file consumable by Logstash, and Logstash take those entries and output them to Elasticsearch.  Doing this will allow us to use Elasticsearch to, well, search through what could be a very huge amount of data in a very short amount of time.  This will also allow us to use monitoring solutions on top of this platform to see log entries in real-time.
      </p>

      <p>
      Download Logstash from the <a href="http://www.logstash.net/">main Logstash page</a>.  There is no installation, since Logstash is deployed as a single jar which can be run using Java.  As of this writing, Logstash does not work with 0.90+ versions of Elasticsearch because of a problem with the version of Lucene used.  Because of this, you must use an older version prior to 0.90 (I used 0.20.6).  Download this from <a href="http://www.elasticsearch.org/downloads/">Elasticsearch's downloads page</a> and follow <a href="http://www.elasticsearch.org/guide/reference/setup/installation/">the instructions to install</a>.
      </p>

      <p>
      One more piece is needed to integrate Log4J with Logstash, and that's a JSON based layout.  The Logstash/Elasticsearch integration expects it's output to be formatted in a specific way, and using this layout makes things a lot easier.  You can view more information about this layout on <a href="https://github.com/logstash/log4j-jsonevent-layout">the project's GitHub page</a>.  Adding this to your pom effectively adds the needed dependency:
      </p>

      <pre className="prettyprint">
{`<!-- JSON layout for logstash integration -->
<dependency>
    <groupId>net.logstash.log4j</groupId>
    <artifactId>jsonevent-layout</artifactId>
    <version>1.3</version>
</dependency>
`}
      </pre>

      <p>
      With that done, add the additional logger to your Log4J configuration.  The full log4j.properties is below (including both the original stdout logger and the new file logger with JSON layout):
      </p>

      <pre className="prettyprint">
{`# Direct log messages to stdout
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.Target=System.out
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%d{ABSOLUTE} %5p %50.50c:%4L - %m%n

# Direct log messages to a log file
log4j.appender.file=org.apache.log4j.DailyRollingFileAppender
log4j.appender.file.File=/tmp/logfile.log
log4j.appender.file.Append=false
log4j.appender.file.DatePattern=.yyyy-MM-dd
log4j.appender.file.layout=net.logstash.log4j.JSONEventLayout

# Root logger option
log4j.rootLogger=DEBUG, stdout, file
`}
      </pre>

      <p>
      Note the path to the log file is set as "/tmp/logfile.log" (this can be changed as you see fit).  Finally, configure Logstash to consume those logs.  This can be done by creating a configuration file in the same directory as your Logstash jar, naming the config file "logstash-log4j.conf":
      </p>

      <pre className="prettyprint">
{`input {
    file {
        path => "/tmp/logfile.log"
        format => "json_event"
        type => "log4j"
    }
}

output {
    elasticsearch {
        host => "127.0.0.1"
    }
}
`}
      </pre>

      <p>
      Note the same matching "/tmp/logfile.log" entry in the Logstash configuration file.  Also note that the output of this is Elasticsearch.  So Log4J is outputting the log entries to a log file, which is being consumed by Logstash and indexed to Elasticsearch.
      </p>

      <h3>Start Logstash and Elasticsearch</h3>

      <p>
      With all configuration in place, start up both Logstash and Elasticsearch.  It's important to start Elasticsearch first, since Logstash will attempt to communicate to Elasticsearch on startup.  To start up Elasticsearch, execute the following command (from the bin directory within the Elasticsearch install location):
      </p>

      <pre className="prettyprint">
{`elasticsearch -f
`}
      </pre>

      <p>
      Elasticsearch should output some debug messages and be ready to go.  In another terminal, begin Logstash with the following command (from the directory containing the Logstash jar and configuration file):
      </p>

      <pre className="prettyprint">
{`java -jar logstash-<version>-flatjar.jar agent -f logstash-log4j.conf
`}
      </pre>

      <p>
      Replace "&lt;version&gt;" with the version of Logstash that you've downloaded.  Logstash should start without any debug information, but you should see Elasticsearch output a connection message.  You can test the configuration by running your original application, and see the log statements output to the log file, picked up by Logstash, and indexed by Elasticsearch.  With the log entries in Elasticsearch, you can now use it as your log storage mechanism, and add nodes to the configuration as needed.
      </p>

      <h2>Monitoring with Kibana</h2>

      <p>
      The last part of this post is on monitoring, which as most know, can be accomplished in a variety of ways. <a href="http://three.kibana.org/index.html">Kibana</a> is an open source tool which works in conjunction with Logstash/Elasticsearch to provide real-time monitoring of your data.  This allows you to go from using log entries as a pure debugging tool, to an analytics engine, giving you an insight into your customer's actions as they occur.  Kibana also offers a <a href="http://three.kibana.org/about.html">variety of ways to display the data</a>, and even allows for custom displays (built using Bootstrap).  And, all for free.
      </p>

      <p>
      To begin, <a href="http://three.kibana.org/intro.html">download Kibana from their site</a>.  The installation instructions are fairly straightforward with Elasticsearch running on the same machine.  Simply download and extract the archive, edit the config.js as specified in the installation instructions, and host the files in any web server.  Once you point your browser to the hosted location, you can click on the "(Logstash Dashboard)" link to avoid any additional configuration steps.  The next page will display the data, with the log messages output from your Java application.  Within this screen you should see options to change the display window, and configure auto-refresh for a real-time like view.  Feel free to configure how Kibana displays the data, or <a href="http://three.kibana.org/about.html">view one of the many tutorial videos on the Kibana site</a> for more information.
      </p>

      <p>
      With these three phases in place, understanding your Java application and how your customer's use it can become a much easier task.  And though these areas are not typically part of the development lifecycle, they can greatly help if used correctly.
      </p>

    </section>
  );
}
