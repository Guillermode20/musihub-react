# Source URL: https://pocketbase.io/docs/js-jobs-scheduling

Jobs scheduling

If you have tasks that need to be performed periodically, you could setup crontab-like jobs with `cronAdd(id, expr, handler)`.

Each scheduled job runs in its own goroutine as part of the `serve` command process and must have:

  * **id** \- identifier for the scheduled job; could be used to replace or remove an existing job
  * **cron expression** \- e.g. `0 0 * * *` ( *supports numeric list, steps, ranges or macros *)
  * **handler** \- the function that will be executed every time when the job runs

Here is an example:

`// prints "Hello!" every 2 minutes cronAdd("hello", "*/2 * * * *", () => { console.log("Hello!") })`

To remove a single registered cron job you can call `cronRemove(id)`.

All registered app level cron jobs can be also previewed and triggered from the *Dashboard > Settings > Crons* section.

* * *

[** Prev: Migrations](/docs/js-migrations) [Next: Sending emails **](/docs/js-sending-emails)