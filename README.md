# news-explorer-api

Api дипломного проекта ЯндексПрактикум.
По заданию необходимо:
1. Создайть схемы и модели ресурсов API:
- user
- article

2. Настроить роуты к ним

3. Реализовать аутентификацию и авторизацию

4. настроить логирование

5. Задеплоить то, что получилось на сервер

Бекенд проекта располагается тут: https://api.explorenews.ml/
 Обратиться к нему можно также по публичному IP - 130.193.37.227


 Реализованы следующие роуты:
POST https://api.explorenews.ml/signup

В теле нужно передать JSON
```
{
    "name": "string",
    "email":"valideamail@yourmail.com",
    "password": "string"
}
```
Ответом вернется сообщение с данными пользователя.

POST https://api.explorenews.ml/signin потребует ввести имейл и пароль
```
{

    "email":"valideamail@yourmail.com",
    "password": "string"
}
```
и вернет JWT токен для дальнейшей авторизации
Остальные роуты можно использовать только с авторизацией.

GET https://api.explorenews.ml/users/me

Вернет информацию о пользователе.


GET https://api.explorenews.ml/articles

Вернет сохраненные пользователем статьи

POST https://api.explorenews.ml/articles - создаст статью если в теле передать сделуюшие параметры
```
{
    "keyword": "string",
    "title":"string",
    "text":"string",
    "date": "string",
    "source":"string",
    "link":"link",
    "image": "link"
}
```

DELETE https://api.explorenews.ml/articles/articleId удалит вашу статью по ИД
