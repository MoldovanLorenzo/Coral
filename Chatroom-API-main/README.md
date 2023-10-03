# Real-Time Chatroom API with Secure User Management

Welcome to the Real-Time Chatroom API, a sophisticated Python Flask-based application that offers real-time messaging capabilities with WebSocket connections and robust user management using a secure password hashing mechanism. This API is a cornerstone for building feature-rich chat applications, and it is designed to ensure both real-time communication and user data security.

## Introduction

The Chatroom API empowers developers to create dynamic chat applications with remarkable features:

- WebSocket Real-Time Messaging: Seamlessly connect users in real-time, allowing them to exchange messages instantaneously.
- Secure User Management: Protect user credentials by employing a rigorous password hashing technique, ensuring the utmost data security.
- Database Integration: Leverage the power of a SQLite database to efficiently manage user information.
- Translation Functionality (Work in Progress): Stay tuned for an upcoming feature that will provide real-time message translation, enabling users to communicate effortlessly across languages.

## Getting Started

To embark on your journey with the Chatroom API, follow these initial steps:

1. Clone the repository to your local environment
2. Install the necessary dependencies using pip
3. Launch the API server by running app.py                                                                                he API server is now up and running and can be accessed at [http://localhost:5000](http://localhost:5000).

## Database and Password Security

The Chatroom API places a strong emphasis on user data security:

- **Database Structure:** The SQLite database integrates seamlessly with the application. User data is stored efficiently, ensuring quick and reliable access.
- **Password Hashing:** User passwords are hashed using the robust bcrypt algorithm. This ensures that passwords are securely stored, mitigating the risk of data breaches.

## Usage

### WebSocket Connections

The API supports WebSocket connections for real-time messaging. Users can establish WebSocket connections to exchange messages. As a forthcoming feature, messages will be automatically translated based on the user's selected language.

### HTTP Endpoints

- **Homepage (/):** This endpoint delivers a warm welcome message to API users.
- **User Registration (/signup):** Users can register by sending a POST request with a chosen username and password. The API enforces unique usernames to enhance security.
- **User Login (/login):** To log in, users must submit their username and password via a POST request. If the credentials are valid, the API will respond with an "OK" status. Otherwise, an error message will be returned.

## Contributing

Contributions to this project are highly encouraged. Whether you have ideas for improvement, bug reports, or code contributions, we welcome your involvement. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Implement your changes and ensure they pass existing tests.
4. Use clear and concise commit messages.
5. Initiate a pull request with a detailed description of your modifications.

Stay tuned for exciting updates and the upcoming translation functionality!      
