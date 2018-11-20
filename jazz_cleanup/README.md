Jazz cleanup service

This microservice cleans up services from a target Jazz environment.

#### Description

Deletes services from a target Jazz environment using the configuration value:

```
"WHITELIST_SERVICES": "{namespace}:{services}"
```

The *namespace* and/or *namespace/service* listed under *WHITELIST_SERVICES* are excluded when running cleanup.  

The allowed values for services are **&ast;** - indicating all services in that *namespace*. Alternatively you can provide a comma-separated list of *services* in that *namespace*. 

You can also specify a list of namespace-services combo by using the delimiter **;**.

A valid value for this configuration is:  
```
"WHITELIST_SERVICES": "jazz:*;foo:bar,baz;"
```

In the example above, the service will remove all services from Jazz target environment except for the ones under namepsace *jazz* and *bar* and *baz* from namespace *foo*.
