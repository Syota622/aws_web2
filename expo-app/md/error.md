- 同じビルドはTestFlightに提出できない
```
[Application Loader Error Output]: The provided entity includes an attribute with a value that has already been used The bundle version must be higher than the previously uploaded version: ‘11’. (ID: f9bd07b1-1e54-47c4-8b67-64a0640abe6b) (-19232)
```
- developのビルドは利用できない
```
Invalid Provisioning Profile for Apple App Store distribution. The application was signed with an Ad Hoc/Enterprise Provisioning Profile, which is meant for "Internal Distribution". In order to distribute an app on the store, it must be signed with a Distribution Provisioning Profile. Ensure that you are submitting the correct build, or rebuild the application with a Distribution Provisioning Profile and submit that new build.
Failed to submit the app to the store
```