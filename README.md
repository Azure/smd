## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.

## Thing Model validation

Files in `models/` contain W3C Web of Things Thing Models. Each file should
contain one Thing Model object; legacy files containing arrays are also
supported during migration. Every model is validated against the official WoT
Thing Description 1.1 Thing Model JSON Schema from the
[W3C WoT Thing Description repository](https://github.com/w3c/wot-thing-description/blob/REC1.1/validation/tm-json-schema-validation.json).
The validator uses the same Ajv configuration as the W3C schema tests.

Run the validation locally with:

```sh
npm ci
npm test
```

Pull requests that change models or validation files run the same command in
GitHub Actions.
