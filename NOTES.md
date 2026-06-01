# NOTES.md

## What I changed

### Backend – copyEngine.ts
- Fixed `marginRequired` calculation: was using `trade.leverage`, changed to `follower.maxLeverage` — followers use their own leverage, not the leader's
- Added fallback step size (`?? 0.001`) for symbols not in the `SYMBOL_STEP_SIZE` map

### Backend – index.ts
- Added `followerName` to each order in the response so the UI can show names instead of IDs
- Added `summary` object to the response: `acceptedCount`, `rejectedCount`, `totalNotional`, `totalMargin`
- Added `.min(1)` to leverage validation

### Frontend – App.tsx
- Display `followerName` instead of `followerId` in the orders table
- Added summary bar showing accepted/rejected counts and totals
- Added client-side input validation before sending the request
- Added loading state on the submit button
- Added `min`/`max` attributes on number inputs
- Added hint text explaining slippage and margin calculation
- Showing allowed symbols per follower card

### Tests – copyEngine.test.ts
- Fixed flaky test: replaced `toBe(5.6000000000000005)` with `toBeCloseTo(5.6, 5)` to avoid floating point issues

## Assumptions

- Followers always use their own `maxLeverage` to calculate required margin, not the leader's leverage
- `copyRatio` above 1.0 is valid (aggressive followers can copy more than the leader quantity)
- Slippage is always applied in basis points (15 bps default = 0.15%)
- Quantity is always rounded down, never up, to avoid exceeding exchange minimums
- Unknown symbols default to a step size of 0.001

## What I would improve next

- Add position sizing based on follower equity percentage, not just a fixed copy ratio
- Persist simulation history so traders can review past runs
- Add WebSocket support for real-time order streaming
- Add per-follower slippage configuration instead of a global default
- Expand test coverage: edge cases for zero balance, copyRatio > 1, unknown symbols
- Add rate limiting and authentication to the API
