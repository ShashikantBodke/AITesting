<!-- Role -> You are a QA automation tester with 15 years of experience, You have a very good understanding of IT, CRM projects like [salesforce.com](https://salesforce.com/). You need to create a framework with Selenium, Java, Maven, TestNG, and it should be enterprise-level framework that we need to create.



I  -> Instructions

- Generate a Complete Selenium with Java automation script following the standard of enterprise level standards.
- Automate and verify the results of the login page [login.salesforce.com/?locale=in](https://login.salesforce.com/?locale=in), ensure that UI is thoroughly tested with valid and invalid testcases.
- [Critical] - Apply the TestNG annotations, @Test, @BeforeTest and others and and necessary setup/teardown logic.
- [Critical] Implement robust exception handling within both Page Object model and test scripts using structured try–catch blocks or explicit exception signatures. 
- [Mandatory] Use Page Object Model with PageFactory, including @FindBy, constructor initialization, and reusable action methods. 
- [Mandatory] - It is important that you use only the xpath not the css selectors. 
- [Output] - - Output only runnable code, no explanations, comments, dependencies, or extra text. 
- [Don't] - Don't use the css selectors, ID, name and others things.
- [Don't] - Don't add comments, Thread.sleep and other bad coding practice.
- [Generate] - Generate the 2 scripts only with the valid and invalid testcases of the login page.
- [Don't Use] Thread.sleep() anywhere; rely on WebDriverWait or implicit waits. 
- Maintain a consistent structure, readability, and modularity across all generated scripts.




C -> Context
You are creating a login page scripts with proper framework for the sales force login, which is a AB Testing website with valid and invalid login page where in the login page you have the email, password and submit button with remember me functionality. 



**E -> Example**
Example structure for PageFactory:

public class LoginPage {
 @FindBy(xpath = "//input[@id='username']")
 WebElement username;



@FindBy(xpath = "//input[@id='password']")
WebElement password;

@FindBy(xpath = "//input[@id='Login']")
WebElement loginButton;

public LoginPage(WebDriver driver) {
    PageFactory.initElements(driver, this);
}

public void doLogin(String user, String pass) {
    username.sendKeys(user);
    password.sendKeys(pass);
    loginButton.click();
}





**P -> PARAMETERS**
with production level automation script expert with pin point accuracy and almost zero bad coding practice. 

-  I have external URLs, external staging URLs. I will give you the external username and password as well 


O -> Output
Provide only: 

- 1 Page Object file 
- 2 TestNG test scripts
- Maven project
- No explanations or additional content.


T -> Tone 
Technical, precisely, enterprise-grade, code-one. 

## Additional Things
Using this framework, we can generate a Playwright framework as well.

Using this framework, we can generate API,BDD automation code as well?

Using this framework, we can generate Test Plan, Testcase or STLC as well?

First copy this prompt in md file then attach this to chatbot and set Plan Mode  
-->



---
**ROLE:** You are a QA automation tester with 15 years of experience. You have deep expertise in IT, CRM projects like Salesforce. You create enterprise-grade automation frameworks.

**INSTRUCTIONS:**
- Generate a **complete Selenium with Java automation script** following standard enterprise-level practices.
- Automate the **login page [login.salesforce.com/?locale=in](https://login.salesforce.com/?locale=in)** with both **valid** and **invalid** test cases.
- **Critical:** Apply appropriate TestNG annotations (@Test, @BeforeTest, etc.) and necessary setup/teardown logic.
- **Critical:** Implement **robust exception handling** using structured try–catch blocks or explicit exception signatures in both the Page Object Model and test scripts.
- **Mandatory:** Use **Page Object Model with PageFactory**, including @FindBy, constructor initialization, and reusable action methods.
- **Mandatory:** Use **only XPath** locators. Do NOT use CSS selectors or other locator strategies.
- **Output:** Provide only runnable code without explanations, comments, dependencies, or extra text.
- **Avoid:** Do NOT use CSS selectors, ID, name, or other locator strategies. Do NOT add comments, Thread.sleep, or other anti-patterns.
- **Generate:** Produce **exactly 2 test scripts** covering valid and invalid login scenarios.
- **Do Not Use:** Do not use Thread.sleep(); rely on WebDriverWait or implicit waits.
- Maintain consistent structure, readability, and modularity.

**CONTEXT:**
You are testing the Salesforce login page at [login.salesforce.com/?locale=in](https://login.salesforce.com/?locale=in). This is a standard login interface with fields for username, password, and a submit button, plus a “Remember Me” option.

**EXAMPLE (PageFactory Structure):**
```java
public class LoginPage {
    @FindBy(xpath = "//input[@id='username']")
    WebElement username;

    @FindBy(xpath = "//input[@id='password']")
    WebElement password;

    @FindBy(xpath = "//input[@id='Login']")
    WebElement loginButton;

    public LoginPage(WebDriver driver) {
        PageFactory.initElements(driver, this);
    }

    public void doLogin(String user, String pass) {
        username.sendKeys(user);
        password.sendKeys(pass);
        loginButton.click();
    }
}
```

**PARAMETERS:**
Use production-level quality, pin-point accuracy, and near-zero bad coding practices.
- Base URL: `[https://login.salesforce.com/?locale=in](https://login.salesforce.com/?locale=in)`
- Test credentials will be provided separately.

**OUTPUT:**
Provide only:
- 1 Page Object file
- 2 TestNG test scripts
- Maven project structure
- No explanations or additional content

**TONE:**
Technical, precise, enterprise-grade, code-only.
