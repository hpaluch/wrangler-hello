# Wrangler hello

How to publish serverless App on CloudFlare

# Setup

Tested Client OS: `Ubuntu 18.04.2 LTS`

Generally we will follow: [CloudFlare Workers Quick-Start]

## Wrangler install

Wrangler installation instructions
are on its [GitHub's project page][Wrangler - GitHub project]
Project homepage is on: https://github.com/cloudflare/wrangler

NOTE: Wrangler itself is written in [][Mozilla Rust] therefore
`cargo` is preferred option (`npm` version just installs binary
- which may be more convenient).

To install cargo and dependencies issue:
```bash
sudo apt-get install cargo libssl-dev nodejs npm
# around 103MB to download, 300MB of disk space required
```
Additional packages are there:
* `libssl-dev`  - required to build `wrangler`
* `nodejs` and `npm` required for our JavaScript worker
  (for `wrangler build` command)


Now to install wrangler (as non-privileged developer user):
```bash
cargo install wrangler
```
You will likely get warning:
```
warning: be sure to add `/home/LOGIN/.cargo/bin` to your PATH to be able
         to run the installed binaries
```

So I added to my `~/.bash_profile`:
```bash
export PATH=~/.cargo/bin:$PATH
```
and updated path using:
```bash
source ~/.bash_profile
```

Now just try:
```bash
wrangler --help
 wrangler 1.0.0
...
```
Now we need to configure credentials as described
on https://workers.cloudflare.com/docs/quickstart/configuring-and-publishing/

You need (only once) to tell wrangler you CloudFlare credentials
for example
```bash
wrangler config <email> <global_api_key>
```

Where:
* `<email>` is your e-mail you use to login on https://dash.cloudflare.com/login
* `<global_api_key>` is your `Global API Key` - go to your
   Profile Page and click on `View` of `API Keys` -> `Global API Key`

Now edit wrangler.toml - at least:
* `name` - will be domain prefix of your app, I use `hello`
* `zone_id` and `account_id` - go to Dahboard on your domain
  and see `Zone ID` and `Account ID` in the right column.
* `route` you can leave empty so far... (it's missing in docs?)

Now you need to invoke
```bash
wrangler build
wrangler preview
```
There should automatically open browser window with Test app

NOTE: In this example there is no handler on default `/` URI
so the preview will report:
```
GET https://00000000000000000000000000000000.cloudflareworkers.com
Your worker responded with: resource not found
```
You need to change `https://example.com/test` to `https://example.com/test`
and press ENTER or click on `Go` to see results like:
```json
{
 "some": "json",
 "d": "Wed Jun 05 2019 07:30:07 GMT+0000 (Coordinated Universal Time)",
 "url": "https://example.com/test",
 "method": "GET",
 "request_keys": [
  "cf",
  "fetcher",
  "redirect",
  "headers",
  "url",
  "method",
  "bodyUsed",
  "body"
 ]
}
```

Now you need to have some domain on which your app will be visible.
* go to CloudFlare dashboard
* click on `DNS`
* add new DNS record - for example I added:
  ```
  CNAME hello -> henryx.atwebpages.com
  ```

And finally we need to update `route` in `wrangler.toml`. In my
case I used:
```toml
route = "hello.henryx.info/*"
```

Now you need to issue these commands to really publish
you app on your domain:
```bash
wrangler build
wrangler publish --release
```

And voila! You can see my example
at: https://hello.henryx.info/test
 

That's all...


[Mozilla Rust]: https://research.mozilla.org/rust/
[Wrangler - GitHub project]: https://github.com/cloudflare/wrangler
[CloudFlare Workers Quick-Start]: https://workers.cloudflare.com/docs/quickstart/cli-setup/

