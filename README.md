# Test Description

The test suite in this project focuses on thoroughly testing the functionality of the **_MyFormComponent_** component. The suite includes positive and negative test cases to ensure that the form behaves as expected in various scenarios.

The positive test cases cover scenarios such as submitting the form with all fields filled correctly, handling long names, validating complex email addresses, and verifying the ability to change the gender selection. These tests aim to validate the smooth functioning of the form under normal conditions.
On the other hand, the negative test cases focus on capturing potential errors or invalid user inputs. These tests check if the form properly handles scenarios such as leaving the 'Name' field blank, providing an invalid email address, not checking the 'Agree to Terms' checkbox, not selecting a gender, and entering a name with fewer than 3 characters. These tests ensure that appropriate error messages are displayed to guide users in providing valid inputs.

## To run the tests locally, follow the instructions below:

* Clone the repository: `git clone git@github.com:ubodn/use-case-7.git`
* Navigate to the project directory: `cd use-case-7`
* Install the project dependencies: `npm i`
* Run the tests: `npm run test`
* The test results will be displayed in the console, indicating the success or failure of each test case.