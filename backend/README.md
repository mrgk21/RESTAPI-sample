# REST API - backend

### Project Structure
```
backend/src/
├── middleware
│   └── verifyUser.ts
├── routes
│   ├── albums.ts
│   ├── auth.ts
│   ├── comments.ts
│   ├── posts.ts
│   ├── root.ts
│   └── todo.ts
├── server.ts
├── services
│   ├── cors.service.ts
│   ├── db.schema
│   │   ├── albums.schema.ts
│   │   ├── comments.schema.ts
│   │   ├── credentials.schema.ts
│   │   ├── posts.schema.ts
│   │   └── todos.schema.ts
│   ├── db.service.ts
│   └── logger.service.ts
└── types
    └── express
        └── index.d.ts
```
The root file is `server.ts` which calls all the middleware in other folders. 

All the routes are under the `routes` folder. The `verifyUser.ts` middleware handles all token authorizations to every route. A special route `auth.ts` handles login, which generates tokens sent back to the frontend as a cookie. It is exempted from token authorization.

There are 3 services in total:
1. `db.service.ts` and `db.schema` handle all models for mongoDB and add them to the req object.
2. `cors.service.ts`handles cors enabling and helmet for response header security.
3. `logger.service.ts` handles logging during app development. This is disabled during production.

Types folder handles all custome Typescript types and interfaces required in the app.
