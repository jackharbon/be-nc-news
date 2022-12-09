# Project title:

Northcoders News API with article cover

[Trelo](https://trello.com/b/YOuuVcs7)

[Cyclic](https://be-nc-news-img.cyclic.app/api)

[Elephant](postgres://cceesolo:t55oRgsK9CQZXDYjn9sbPy7m8eTlZH7T@mouse.db.elephantsql.com/cceesolo)

[GitHub](https://github.com/jackharbon/be-nc-news-img)

## Description

Test project for API hosting.

## Getting Started

### Dependencies

-   devDependencies:
    -   husky: 8.0.0,
    -   jest: 27.5.1,
    -   jest-extended: 2.0.0,
    -   jest-sorted: 1.0.14,
    -   pg-format: 1.0.4,
    -   supertest: 6.3.1
-   dependencies:
    -   dotenv: 16.0.3,
    -   express: 4.18.2,
    -   pg: 8.8.0
-   jest:
    -   setupFilesAfterEnv: jest-sorted

### Installing

1. clone repository directly from Northcoders to the local machine:

    ```
    https://github.com/northcoders/be-nc-news.git
    ```

2. cd to the folder be-nc-news
3. check links to the repo

    ```
    git remote -v
    ```

4. create a new repo on your GitHub account

    ```
    https://github.com/new
    ```

5. Do NOT follow GitHub instructions, just replace where origin points to

    ```
    git remote set-url origin https://github.com/<your-github>/be-nc-news.git
    ```

6. check repo link again:

    ```
    git remote -v
    ```

7. Set main branch

    ```
    git branch -M main
    ```

    ```
    git push -u origin main
    ```

8. Create files `.env.test` and `.env.development`, add line:

    ```
    PGDATABASE=database_name_here
    ```

    with proper database name.

9. Add both files to `.gitignore`

### Executing program

Check if database is running

```
https://easy-gray-walrus-coat.cyclic.app/api/health
```

## Authors

[Northcoders](https://northcoders.co.uk)

## Version History

-   0.1
    -   Initial Release

## License

This project is licensed under the Open Source License - see the LICENSE.md file for details
