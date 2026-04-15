# Recurring Course Series - Implementation Complete

## What's New

### 1. **Course Series Management** (`/admin/series`)
- Create recurring weekly course patterns (e.g., "Every Saturday at 09:00")
- Set how many weeks ahead to auto-generate (1-12 weeks)
- Pause/resume series without deleting courses
- Delete series with option to remove future unbooked courses

### 2. **Blackout Periods**
- Add date ranges when courses shouldn't run (holidays, closures)
- Automatically deactivates courses in blackout periods
- Remove blackouts to re-activate courses
- Each blackout can have an optional reason/note

### 3. **Auto-Generation**
- Manual trigger: "Generate Courses" button in `/admin/series`
- Creates courses up to N weeks ahead based on each series settings
- Skips blackout dates automatically
- Won't duplicate existing courses

### 4. **Visual Indicators**
- Series badge appears on courses in `/admin/courses`
- Purple "↻ Series" badge shows which courses are auto-generated
- Hover shows "Part of recurring series"

## How to Use

### Creating a Series
1. Go to `/admin/schedule`
2. Click "Add Entry" → "Create Recurring Pattern"
3. Choose:
   - Day of week (e.g., Saturday)
   - Time (e.g., 09:00)
   - Location, spots, price, type
   - **Frequency**: Weekly, Fortnightly, or Monthly
   - Weeks ahead to generate (default: 8)
   - Start date
4. Click "Create Pattern" → generates first batch of courses

### Adding Blackouts
1. In `/admin/series`, find your series
2. Click "Add Blackout"
3. Set start and end dates (e.g., Dec 20 - Jan 5)
4. Optional: add reason (e.g., "Christmas holidays")
5. All courses in that range are auto-deactivated

### Managing Series
- **Edit**: Click pencil icon to modify series settings
  - Changes to time, location, spots, price, type apply to future unbooked courses
  - Updates series pattern for future generation
- **Pause**: Toggle "Active/Paused" to stop generating new courses
- **Delete**: Remove series (optionally delete future unbooked courses)

### Manual Generation
- Click "Generate Courses" in `/admin/series` anytime
- Fills in any missing weeks up to each series' "weeks ahead" setting
- Safe to run repeatedly (won't duplicate)

## Data Models

### CourseSeries
```typescript
{
  dayOfWeek: 0-6,          // 0 = Sunday, 6 = Saturday
  time: "09:00",
  location: "Rochford, Essex",
  spotsTotal: 8,
  price: 65,
  type: "fixed" | "flexible",
  frequency: "weekly" | "fortnightly" | "monthly",  // how often courses repeat
  weeksAhead: 8,           // how many weeks to keep generated
  isActive: true,          // pause/resume
  blackoutPeriods: [       // holiday closures
    { start: Date, end: Date, reason: "Christmas" }
  ],
  lastGeneratedDate: Date  // tracks generation progress
}
```

### Course (updated)
```typescript
{
  // ... existing fields ...
  seriesId?: string        // links to parent series (null for one-offs)
}
```

## API Endpoints

- `POST /api/admin/series` - create series + first batch
- `GET /api/admin/series` - list all series
- `PATCH /api/admin/series/:id` - update series
- `DELETE /api/admin/series/:id` - delete series
- `POST /api/admin/series/:id/blackouts` - add blackout
- `DELETE /api/admin/series/:id/blackouts` - remove blackout
- `POST /api/admin/series/generate` - manual generation trigger

## Example Workflow

### Frequency Examples

**Weekly Pattern** (Saturday 09:00):
- Generates: Mar 22, Mar 29, Apr 5, Apr 12, Apr 19, Apr 26, May 3, May 10 (8 weeks)

**Fortnightly Pattern** (Saturday 09:00):
- Generates: Mar 22, Apr 5, Apr 19, May 3 (every 2 weeks, 8 weeks ahead)

**Monthly Pattern** (Saturday 09:00):
- Generates: Mar 22, Apr 26, May 24 (same day each month, 8 weeks ahead)

### Full Workflow

1. **Create "Weekly Saturday 09:00" series**
   - Generates: Mar 22, Mar 29, Apr 5, Apr 12, Apr 19, Apr 26, May 3, May 10 (8 weeks)

2. **Add blackout: Apr 19 - Apr 26** (Easter break)
   - Those 2 courses auto-deactivate
   - New bookings blocked for those dates

3. **Next week, run "Generate Courses"**
   - Adds May 17 (keeps 8 weeks ahead)
   - Skips Apr 19, Apr 26 (still blacked out)

4. **Remove Easter blackout**
   - Apr 19, Apr 26 courses re-activate
   - Now bookable again

## Multiple Courses Per Day

- You can create multiple series for the same day of week at different times
- Example: Saturday 09:00 series + Saturday 14:00 series
- Each generates courses at their respective times
- No conflicts - duplicate detection uses date+time+location

## One-Off Courses Still Work

- Courses without `seriesId` work exactly as before
- Create individual courses in `/admin/courses` as usual
- Mix and match: have some recurring, some one-off

## Notes

- Series only auto-generates on manual trigger (no cron yet)
- Editing a series updates future **unbooked** courses (spotsRemaining === spotsTotal)
- Booked courses are never auto-modified (protects customer bookings)
- Deleting a series doesn't auto-delete courses (your choice when deleting)
