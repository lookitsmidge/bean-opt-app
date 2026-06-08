
The golden rule of real-world dialing is simple: **Yield controls your flavor balance, while time tells you how to fix your grinder**. When pulling a shot, completely ignore the clock and stare only at your scale. Hit your manual pump-kill button early (around 24.5g to 25g) to force the resting weight onto your target 28g landing gear. This locks in your brewing ratio and guarantees you cut off the heavy, bitter tail end of the roast, regardless of how fast or slow the water is moving.

Once the shot settles, look at the final time to evaluate your grind size. If you hit your target weight within 23 to 32 seconds, your espresso is in the delicious zone and no grinder changes are needed. Only adjust your Eureka dial if the shot falls completely outside these time guardrails, using the quick reference matrix below to log and steer your next extraction.

for **Dark** Roasts...

| If Your Resting Yield is 28g... | ...And Total Pump Time Was: | The Flavor Status: | The Immediate Action: |
| -- | -- | -- | -- |
| Fast Flow,Less than 23 seconds | "Sour, thin, and under-extracted" | Turn Eureka dial finer by 1/4 line. |
| Compensated Flow | 23 to 26 seconds | "Rich, sweet, traditional ristretto" | Perfect save. Keep grinder exactly the same. |
| Goldilocks Flow | 27 to 30 seconds | Peak balance and deep chocolate notes | Perfect tune. Keep grinder exactly the same. |
| Choked Flow | Greater than 32 seconds | "Aggressively bitter, dry, and heavy" | Turn Eureka dial coarser by 1/4 line. |

## Three Roast Profiles

The values vary significantly by bean, specifically between dark, medium and light roast.
### Dark Roasts
- **Beans**: Oily, dark brown, low acidity (e.g. traditional italian blends)
- **Target Ratio**: 1:1.5 to 1:1.75 ristretto territory (e.g. 18g in -> 27-30g out)
- **Time Window**: 23 to 28 seconds. because they dissolve so easily, they taste sweet early on, letting them run past 30 seconds instantly pulls out harsh ash and bitter wood flavours

### Medium Roasts
- **Beans**: chocolate color, matte texture, balanced acidity (e.g., modern espresso blends, house blends from local specialty roasters).
- **Target Ratio**: 1:2 standard normale (e.g. 18g in -> 36g out)
- **Time Window**: 26 to 30 seconds. They require a bit more contact time and slightly more water volume to wash out the pleasant fruit notes and milk-chocolate sweetness.

### Light Roasts
- **Beans**: Light tan, dense, high acidity (e.g. single-origin Ethiopian or Kenyan beans)
- **Target Ratio**: 1:2.5 to 1:3 lungi territory (e.g. 18g in -> 45g-54g out)
- **Time Window**: 30 to 35+ seconds. These beans are incredibly dense and stubborn. You intentionally grind them incredibly fine to extract slowly, and you push way more water through them just to dissolve enough sugars to balance out their intense natural acidity

| Roast Profile | Target Extraction Ratio | Target Yield (On 18g Dose) | Healthy Time Window | "If It Runs Faster Than This, Grind Finer:" |
| -- | -- | -- | -- | -- |
| Dark | 1:1.5 to 1:1.7 | 25g – 30g | 23 – 28 seconds | Less than 23 seconds |
| Medium | 1:2.0 | 36g | 26 – 30 seconds | Less than 25 seconds |
| Light | 1:2.5 to 1:3.0 | 45g – 54g | 30 – 35+ seconds | Less than 29 seconds |


Espresso is an agreeable sliding scale - you dont need a "perfect 30 second shot", you just need to be within the timerange for the yield.


## Warnings and Pre-Notifications
- **Micro-Drift Alert**: Instead of waiting for a total failure, your app can look at a 4-day rolling average. If it sees your 18g-to-28g shot consistently speeding up by 1 second every morning, it can trigger a subtle UI flag: "Beans are degassing naturally. Your next shot might benefit from a micro-nudge finer."
- **Smart Purge Calculator**: When the user finally logs that they did adjust the grinder, your app can display a clear check-box reminder: "Grinder adjusted coarser! Remember to run a 4-second purge to clear the chute before your next pull."

## Grinder Mechanics & Thermal Workflow Rules

### 1. The Grinder Gear-Slack (Backlash) Law
The Eureka Specialità stepless worm-gear mechanism has mechanical play (slack) inside the internal threads. 
- **When moving Finer:** The threads engage immediately. A micro-nudge shows up instantly in the next cup.
- **When moving Coarser:** The gear teeth must wind up the slack. **Never make a micro-nudge coarser.** Instead, intentionally overshoot the dial coarser by 1 full notch line, run a heavy purge, and then walk it back finer to your target setting to lock the gear threads in place.

### 2. The Chute Retention / Purge Rule
The grinding chamber and exit chute retain a dense plug of compacted coffee fragments from the previous grind setting.
- **Coarser adjustments** leave fine dust trapped in the chute. Failing to purge will cause the next shot to choke unexpectedly.
- **Finer adjustments** leave larger fragments trapped. Failing to purge will cause the next shot to run away fast.
- **Action:** *Always* run a manual **3 to 4-second purge** into a waste cup immediately after moving the dial in either direction before dosing into the portafilter.

### 3. The 45-Second Thermal Choreography Window
Running a blank warming shot heats the portafilter and IMS basket to peak extraction temperature, but the metal sheds heat rapidly into the room while simultaneously baking the coffee bed if left standing.
- **The Choke Trap:** If puck prep takes longer than 60 seconds after the warming flash, the hot dry basket bakes the bottom layers of coffee, hyper-restricting flow and mimicking a "too fine" grind size.
- **The Protocol:** Execute the transition from the blank hot flush, to the microfiber bone-dry wipe, to the shaker dump, to the edge-rolling perimeter tamp, to the pump engagement in **under 45 seconds** to keep the thermal environment completely stable.
