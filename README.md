# OAuthSpring

A Spring Boot application that provides **login with Google (OAuth2)** and persists authenticated **user information in a MariaDB database**.

---

## Features

- Google OAuth2 login integration with **Spring Security**.  
- Retrieves user profile information (email, name, etc.) from Google after successful authentication.  
- Saves or updates user data in a **MariaDB** database using JPA.
- Prevents duplicates by checking existing users by email.  

---

## Implementation Details

### Security & Authentication
- Configured with **Spring Security OAuth2 Client**.  
- Google is defined as the external OAuth2 provider (`spring.security.oauth2.client.registration.google`).  
- A custom `CustomOAuth2UserService` extends `DefaultOAuth2UserService` to process user details received from Google:
  - Checks if the user already exists in the database.
  - Creates a new record if not found, or updates attributes if the user exists.  

### Application Flow
1. User visits a protected endpoint and is redirected to Google login.  
2. After successful authentication, Google redirects back with an authorization code.  
3. Spring Security exchanges it for tokens and user info.  
4. `CustomOAuth2UserService` processes the user info and persists it in MariaDB.  
5. Application returns the authenticated session with the user stored.  

---

## Configuration

Set up your Google credentials and database connection in `src/main/resources/application.properties`:

```properties
# MariaDB
spring.datasource.url=jdbc:mariadb://localhost:3306/oauthspring
spring.datasource.username=your_username
spring.datasource.password=your_password

# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
spring.security.oauth2.client.registration.google.scope=openid,profile,email

```

## Security Configuration (detailed explanation)

The core of this project lies in the `SecurityFilterChain` configuration, which defines how requests are authorized, how OAuth2 login with Google is integrated, and how logout is managed.

### 1. Authorizing Requests
The configuration first defines which endpoints are public and which require authentication:
- `"/"` and `"/login"` are **permitted to all users**, even if they are not logged in.
- Every other request (`anyRequest()`) requires the user to be **authenticated**.

This ensures that only logged-in users can access protected resources while still allowing public access to the homepage and login page.

### 2. OAuth2 Login
The next section enables **Google OAuth2 login**:
- The application uses `oauth2Login()` to delegate authentication to Google.
- After login, the **user information endpoint** is configured.
- A custom user service (`customOAuth2UserService`) is used here. Its role is crucial:
  - It takes the profile information returned by Google (such as email and name).
  - It checks the MariaDB database to see if this user already exists.
  - It creates a new record or updates the existing one, keeping the database in sync with Google.

### 3. Logout Handling
The configuration also defines how logout works:
- The logout URL is set to `"/logout"`.
- After logout, the user is redirected back to the homepage (`"/"`).
- The current HTTP session is invalidated.
- The session cookie (`JSESSIONID`) is deleted to prevent reuse.

This guarantees that logout is secure and leaves no traces of the authenticated session.



