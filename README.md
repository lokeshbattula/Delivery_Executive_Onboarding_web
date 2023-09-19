# Delivery_Executive_Onboarding_web

   Delivery Executive Onboarding
Objective of the Tool: 

The objective of our web-based tool is to provide an efficient and user-friendly platform for individuals interested in becoming delivery executives.
This tool aims to streamline the registration process, allowing users to easily sign up and apply for delivery executive positions. Additionally, it will enable registered users to log in and track the status of their applications, ensuring a convenient and transparent experience throughout the entire process.

For the Delivery Management team : 

The objective of this web-based tool is to efficiently manage user data, including personal information, bank details, and images, along with registration timestamps. It also tracks approvals granted by administrators. For each administrator, we record their phone number and the approval objects, each containing the user's phone number and the corresponding approval timestamp.

Technologies and modules Used: HTML, CSS, Javascript, Node.js, Express.js, body-parser(middleware), dotenv, multer, sharp, cookie-parser, ejs, MongoDB, Mongoose, nodemon.

Client Side:

User:

Step-1:

On the login page, the user can log in if the user is already signed up otherwise, the user can click on the Create account link to sign up.

Step-2:

After login, the user will get a registration form where the user can fill in the required details (full name, email, address, Pincode, bank details, passbook image, driver's license, RC image, PAN number, PAN card image, etc.,)

Step-3:

After submitting the form, the user will get to see his details and the status of the application.

Step-4:

With the logout button, the user can log out from the application.

Admin: 

On admin login, you will get to see a dashboard with the users details in the form of a table.
STATUS FILTER: You can use status to categorize the users as Pending, Approved, Rejected, or Not Registered. While filtering you get the user details in the order of time at which the user is registered.
You can go to the user profile by clicking on the Mobile number of the user, In the user profile you will have the user details along with the images the user has uploaded.
APPOVE and REJECT: Under the form, you can see the Approve and Reject buttons which the admin can select after reviewing the above details. 
After reviewing the application the admin can log back to the admin page using the BACK TO ADMIN button at the top.

Server Side:

Express.js - Built an application server and managed API requests.

EJS (Embedded JavaScript) - Employed for embedding JavaScript within HTML code to enhance web page functionality.

Body-parser - Utilized for processing data from incoming request bodies, ensuring data accuracy and reliability.

Multer - Enabled secure image uploads to MongoDB and dynamically resized images to meet specific size requirements.

Sharp - Used for image resizing in conjunction with Multer.

Cookie-parser - Managed and stored login credentials, maintaining session data until logout.

dotenv - Employed to store sensitive information (e.g., MongoDB URL, admin credentials, and port numbers) in environment variables.

Mongoose - Seamlessly interacted with MongoDB, simplifying data retrieval and manipulation, particularly for user information and approvals.

Database (MongoDB):

   Users Collection:
   
  I have created user collection to store user details like (full name, email, address, Pincode, bank details, driver's license, PAN number, and Registered time(time at which the user registered)).
  
Here the phone is unique for every document in the collection.
Images Collection:

 I have stored the image data in the images collection along with the phone of the user by converting them into base64.
Admin Collection:

 I've set up an 'Admin' collection to manage administrative tasks. Within this collection, I store the records of approvals granted by admins. Instead of using a nested array, I've structured this data more neatly. For each admin, I keep track of their phone number and create an 'approvals' array. Inside this array, I store objects that represent each approval. Each of these approval objects contains the user's phone number and the timestamp when the approval was granted 
