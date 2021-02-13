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
