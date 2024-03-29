[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![GitHub issues](https://img.shields.io/github/issues/fhswf/book_me)
![GitHub pull request check state](https://img.shields.io/github/status/s/pulls/fhswf/book_me/10)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/fhswf/book_me/release-backend)
[![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/fhswf/book_me)](https://libraries.io/github/fhswf/book_me)

# APPointment

This web application helps you planning your appointments.

As a _provider_ of appointments (i.e. consultation hours) you can manage times when you are available for different types of appointments
(online, in person, different durations) and integrate your Google calendar.

As a _client_, you can search for available slots and book an appointment. You will receive an invitation from the calendar service of the provider.

## Deployment

details tbd ...

### Configuration

- provide details in `docker.env` and `.env`

### Docker

- Check configuration in `docker-compose.yml` (exposed port)
- build & deploy frontend by running

```shell
npm run-script build
cp -r build/* <deployment dir>
```

- build an run backend

```shell
docker-compose build
docker-compose up
```
