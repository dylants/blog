import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Using Spring to Model Data and Build REST Endpoints, with XML-less Configuration';
const TIMESTAMP = '20130923';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130923/spring.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>
      Web applications have been built for years, and Java has often been a top choice as a technology platform. However, the act of using Java to build a web application can feel quite laborious at times with all the duplication and excessive configuration necessary to stand one up. Java EE hasn't had the best reputation for an easily understood web platform, and it's because of this that outside frameworks have emerged attempting to fix this problem. <a href="http://spring.io/">Spring</a> is one of the most popular Java web application frameworks, and provides many (<a href="http://spring.io/projects">many!</a>) useful open source products to make the task of building a Java web application much easier.
      </p>

      <p>
      Although Spring offers a variety of projects that help web application developers, I'd like to focus on just a few: <a href="http://projects.spring.io/spring-data/">Spring Data</a> to manage the entities, and Spring Web MVC (which is actually part of the <a href="http://projects.spring.io/spring-framework/">Spring Framework</a> project) to expose that data as REST API endpoints. The intent is to easily define your data and provide REST APIs around creating, reading, updating, and deleting those entities. All of this without any XML configuration, but instead use Spring's Java configuration. The result is a much cleaner and more intuitive code base, with very little duplication.
      </p>

      <h2>Example Projects</h2>

      <p>
      Some example projects can be useful in getting a larger picture of how this all works. I've created a couple projects to help illustrate use cases, and pushed them to GitHub. The first project, <a href="https://github.com/dylants/spring-data-web-app">spring-data-web-app</a>, is a very basic scaffold project that exposes a Book resource. The second, <a href="https://github.com/dylants/library-api">library-api</a>, builds on the first in an attempt to provide a more detailed solution, while also using <a href="http://projects.spring.io/spring-hateoas/">spring-hateoas</a> in it's REST layer. The examples below borrow code from those projects; feel free to view the full source online.
      </p>

      <h2>Base Configuration: Removing the web.xml</h2>

      <p>
      The initial configuration comes from the web.xml, which in an XML-less configuration, can be replaced using Spring's AbstractAnnotationConfigDispatcherServletInitializer (yes, that's a very long class name). By extending this class and providing a few attributes, you can create a Java project that no longer needs the web.xml, and all data that normally resides in the web.xml would instead live in this class. This is great for debugging, but could be a win to avoid XML if nothing else.
      </p>

      <p>
      Below is an example implementation, and shows how only three data points are required: the root configuration classes, servlet configuration classes, and servlet mappings:
      </p>

      <pre className="prettyprint">
{`public class WebApplicationInitializer
    extends AbstractAnnotationConfigDispatcherServletInitializer {
{

    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[]{RootContextConfiguration.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[]{ServletContextConfiguration.class};
    }

    @Override
    protected String[] getServletMappings() {
        return new String[]{"/api/*"};
    }

    // ...

}
`}
      </pre>

      <p>
      In the example above, the <code>RootContextConfiguration.class</code> is provided as the sole root configuration class, <code>ServletContextConfiguration.class</code> is provided as the sole servlet configuration class, and <code>"/api/*"</code> will map to our servlet.
      </p>

      <h3>RootContextConfiguration</h3>

      <p>
      The RootContextConfiguration class is responsible for defining beans that should exist in the root context, outside of any servlet contexts. Using Spring's <code>@Configuration</code> annotation, we can easily define this class as a Configuration, which is then responsible for creating Spring managed beans. Each bean is declared in the class and annotated using the <code>@Bean</code> annotation. The root context usually contains beans used for Data, Security, or other root level concepts. Using Spring Data, we can add some additional annotations to help easily define our data layer. Below is an example, using an embedded database and Hibernate:
      </p>

      <pre className="prettyprint">
{`@Configuration
@EnableJpaRepositories
public static class RootContextConfiguration {

    @Bean
    public DataSource dataSource() {
        // Use an HSQL embedded database
        return new EmbeddedDatabaseBuilder().
            setType(EmbeddedDatabaseType.HSQL).build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        // use Hibernate
        HibernateJpaVendorAdapter vendorAdapter =
            new HibernateJpaVendorAdapter();
        vendorAdapter.setDatabase(Database.HSQL);
        vendorAdapter.setGenerateDdl(true);

        LocalContainerEntityManagerFactoryBean em =
            new LocalContainerEntityManagerFactoryBean();
        em.setJpaVendorAdapter(vendorAdapter);
        // scan from here for repository beans
        em.setPackagesToScan(getClass().getPackage().getName());
        // set the data source (database configuration)
        em.setDataSource(dataSource());

        return em;
    }

    @Bean
    public PlatformTransactionManager transactionManager() {
        // Use Spring's JPA transaction manager
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(
            entityManagerFactory().getObject());
        return transactionManager;
    }
}
`}
      </pre>

      <p>
      This basic example defines three beans necessary to outline our data layer, the most important of which is the <code>DataSource</code>, which in this case is an embedded HSQL database. Using an embedded database is great for development as it doesn't require any additional setup, but will not retain any data after the application is shut down. Notice also the use of the <code>@EnableJpaRepositories</code> annotation. This annotation is necessary to use Spring's repositories (which we'll cover below).
      </p>

      <h3>ServletContextConfiguration</h3>

      <p>
      Similar to the RootContextConfiguration, the ServletContextConfiguration is a Configuration class that defines beans, but only for our servlet. Typically beans defined at the servlet level are responsible for a single action or use case. For us this is exposing our data as REST endpoints. For this, we'll again utilize Spring, specifically the Spring Web MVC project. We can define these endpoints as controllers in separate classes, so the job of the ServletContextConfiguration would be to point Spring at those classes at let it do the rest. In the end, our configuration class is quite simple once we take advantage of the annotations:
      </p>

      <pre className="prettyprint">
{`@Configuration
@EnableWebMvc
@ComponentScan(includeFilters = @Filter(Controller.class), useDefaultFilters = false)
public static class ServletContextConfiguration {

}
`}
      </pre>

      <p>
      We're again defining a configuration class using the <code>@Configuration</code> annotation. The <code>@EnableWebMvc</code> annotation enables and configures most of what Spring MVC provides, including the ability to build REST endpoints using Spring controllers (more information on the specifics of this annotation can be found in the <a href="http://docs.spring.io/spring/docs/3.2.x/spring-framework-reference/html/mvc.html#mvc-config-enable">Spring MVC documentation</a>). Finally, the <code>@ComponentScan</code> annotation informs Spring it should scan for classes which contain the <code>@Controller</code> annotation, and include them in this servlet context.
      </p>

      <p>
      By defining and including both of these configuration classes in our WebApplicationInitializer, we've done all we need to configure our web application. And we've done it all in Java, without any XML files.
      </p>

      <h2>Defining an Entity</h2>

      <p>
      With the configuration in place, we can begin to build our web application. A good starting point is the data, which we'll abstract out using JPA. Spring Data supports multiple data access technologies, including JPA. (Support for additional technologies can be found on the <a href="http://projects.spring.io/spring-data/">Spring Data projects page</a>.) Let's start by taking a look at an example entity, a <code>Book</code>:
      </p>

      <pre className="prettyprint">
{`@Entity
public class Book extends AbstractPersistable<Long> {

    private String title;
    private String author;

    // ...

}
`}
      </pre>

      <p>
      At the entity level, we're using a combination of the Java persistence package and Spring Data. To define this class as an entity, which allows us to manipulate the data as a Java object, we annotate the class with the <code>@Entity</code> annotation. We've also taken advantage of a base class provided by Spring, <code>AbstractPersistable</code>, which takes care of defining the ID property as a <code>Long</code> (in our example). The <code>Book</code> has two attributes: <code>title</code> and <code>author</code>, both of which are Strings.
      </p>

      <p>
      Note that validation could be added here using JSR-303 bean validation. This allows you to specify that an attribute is required, or must be a certain length or size, etc. This is most likely done through Hibernate's validator annotations. More information can be found in the <a href="http://docs.spring.io/spring/docs/3.2.x/spring-framework-reference/html/validation.html#validation-beanvalidation">Spring documentation for validation</a>.
      </p>

      <h2>Defining a Repository</h2>

      <p>
      Repositories provide the ability to perform the CRUD operations (create, read, update, delete) on the entity. These interact directly with the data layer, but attempt to abstract out the internals of the data access technology to those which consume the repository. This allows you to code to an interface rather than an implementation.
      </p>

      <p>
      Coding up a repository would normally consist of a lot of boiler plate code to provide the implementations of the CRUD operations. Spring Data helps to remove that burden by providing implementations per data access technology. In using JPA, we only need to extend an interface (while also including configuration to enable JPA repositories, as discussed in the configuration section of this post). With that, the code required to create a repository for a <code>Book</code> resource is only:
      </p>

      <pre className="prettyprint">
{`public interface BookRepository extends PagingAndSortingRepository<Book, Long> {

}
`}
      </pre>

      <p>
      In this example, we've chosen to extend the <code>PagingAndSortingRepository</code> which provides us with additional methods on top of the <code>CrudRepository</code>. Either of which could be used depending on your specific needs. By extending either of these interfaces, we can inject the repository where its needed, and we'll have access to CRUD operations, and optionally paging and sorting operations. Spring will map the implementation to the resource dynamically &mdash; it's actually quite cool!
      </p>

      <h2>Building REST Endpoints</h2>

      <p>
      The ServletContextConfiguration has established the configuration necessary to begin to build out REST endpoints, the first of which will be focused around the <code>Book</code> resource. Using Spring's <code>@Controller</code> annotation, we can define a class as a Spring bean that provides methods which respond to certain requests. We can define those requests using Spring's <code>@RequestMapping</code> annotation along with a <code>value</code> to specify the URL (which will be appended to the web app context root plus any servlet mappings). With both annotations specified, we're able to then define methods which are responsible for the GET, POST, PUT, and DELETE operations.
      </p>

      <p>
      Below is an example of such a controller, defining first just the method responsible for the root GET operation on <code>"/books"</code>:
      </p>

      <pre className="prettyprint">
{`@Controller
@RequestMapping("/books")
public class BooksController {

    @Autowired
    private BookRepository bookRepository;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public Iterable<Book> getBooks() {
        return this.bookRepository.findAll();
    }

    // ...

}
`}
      </pre>

      <p>
      At the class level we've annotated <code>BooksController</code> as a controller responding to requests for <code>"/books"</code>. We've then used Spring's <code>@Autowired</code> annotation to inject in the <code>BookRepository</code> which we created earlier. Finally, a single method has been defined which responds to GET requests, returning the value in the response body (using the <code>@ResponseBody</code> annotation). This method uses the <code>BookRepository</code> to find all available <code>Book</code>'s and return them in the response. (Note that we never wrote the <code>findAll()</code> method for the <code>BookRepository</code>. This and many other methods are provided by Spring Data once we took advantage of the supplied interfaces when defining the <code>BookRepository</code>.)
      </p>

      <p>
      This endpoint is available then to query for all <code>Book</code> resources in the system. If we were to have one <code>Book</code> with a title of "The Cat in the Hat" and author "Dr. Seuss", hitting this endpoint from a browser would return:
      </p>

      <pre className="prettyprint">
{`[
    {
        id: 1,
        title: "The Cat in the Hat",
        author: "Dr. Seuss"
    }
]
`}
      </pre>

      <p>
      The additional POST, PUT, and DELETE operations can be defined as follows (without any validation or error checking done):
      </p>

      <pre className="prettyprint">
{`@RequestMapping(method = RequestMethod.POST)
@ResponseBody
public Book addBook(@RequestBody Book book) {
    return this.bookRepository.save(book);
}

@RequestMapping(value = "/{bookId}", method = RequestMethod.PUT)
@ResponseBody
public Book updateBook(@PathVariable Long bookId, @RequestBody Book book) {
    // make sure the book we're to save has the correct ID
    book.setId(bookId);
    return this.bookRepository.save(book);
}

@RequestMapping(value = "/{bookId}", method = RequestMethod.DELETE)
public void deleteBook(@PathVariable Long bookId) {
    Book book = this.bookRepository.findOne(bookId);
    this.bookRepository.delete(book);
}
`}
      </pre>

      <p>
      A couple of new annotations were used in the above methods: <code>@PathVariable</code> and <code>@RequestBody</code>. The <code>@PathVariable</code> annotation provides a way to access variables specified in the path, by combining this annotation with the value of the <code>@RequestMapping</code>. The <code>@RequestBody</code> annotation informs Spring that the incoming body of the request should be mapped to the specified class type. This allows us to easily access an incoming <code>Book</code> resource in the POST and PUT operations.
      </p>

      <p>
      These REST APIs are now available to perform the necessary CRUD operations on the <code>Book</code> resource. By taking advantage of Spring Data, as well as the Spring Web MVC project, we're able to easily and quickly define a resource, build a repository around this resource, and expose the resource with a set of REST APIs. And with the new Java configuration, Spring allows us to do this all without any XML files.
      </p>

    </section>
  );
}
