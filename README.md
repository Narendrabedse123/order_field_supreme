1. Set Up
Clone the repository: 
```
https://bitbucket.org/arcasan/arcafy-metafield-app/src/master/

```

2. Create your environment file:
```
cp .env.example .env
```

The app key is used to salt passwords. If you need to work with production data you'll want to use the same app key as defined in the .env file in production so password hashes match.

3. Update these settings in the .env file:
DB_DATABASE (your local database, i.e. "todo")
DB_USERNAME (your local db username, i.e. "root")
DB_PASSWORD (your local db password, i.e. "")
HASHIDS_SALT (use the app key or match the variable used in production)

4. Install PHP dependencies:
```
composer install
```

If you don't have Composer installed, install the composer https://getcomposer.org/.

5. Generate an app key:
```
php artisan key:generate
```


6. Generate JWT keys for the .env file:
```
php artisan jwt:secret
```

7. Run the database migrations:
php artisan migrate

8. Install Javascript dependencies:
```
npm install
```

If you don't have Node and NPM installed, Install the NPM / Node. https://www.npmjs.com/get-npm

9. Run an initial build:
```
npm run watch
```