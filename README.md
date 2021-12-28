# Darts Tracker Backend API

API services for the Darts Tracker backend system.

#### Usage

To use this repo locally you need to have the [Serverless framework](https://serverless.com) installed.

```bash
$ npm install serverless -g
```

Clone this repo.

```bash
$ git clone https://github.com/adamldoyle/darts-tracker-api
```

Go to one of the services in the `services/` dir.

And run this to deploy to your AWS account.

```bash
$ serverless deploy
```

The services are dependent on the resources that are created [in this accompanying repo](https://github.com/adamldoyle/darts-tracker-resources).

#### Acknowledgements

Based on structure documented by [Serverless Stack](https://github.com/AnomalyInnovations/serverless-stack-demo-ext-api).

#### Maintainers

[Adam Doyle](mailto:adamldoyle@gmail.com)
