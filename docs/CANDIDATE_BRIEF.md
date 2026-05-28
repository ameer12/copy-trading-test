# Candidate Brief: Copy Trading Simulator

## Time limit

Please spend **2–3 hours maximum**.

## Scenario

You are joining a team building a copy trading platform. A lead trader opens a position, and follower accounts should receive copied orders based on their account settings and risk limits.

This is not connected to a real exchange. It is a simulator, but the business logic should look realistic.

## Your tasks

### 1. Trading engine

Improve the backend copy trading engine in:

```txt
backend/src/copyEngine.ts
```

The copied order logic should handle:

- Follower copy ratio
- BUY/SELL slippage
- Exchange quantity step size
- Follower max leverage
- Follower allowed symbols
- Follower max notional per trade
- Available margin checks
- Clear rejection reasons

### 2. API quality

Improve the `/api/simulate-copy` endpoint where useful.

You may add validation, better errors, or clearer response shape.

### 3. UI

Improve the React UI so that a product manager or trader can understand what happened after a simulation.

Useful improvements include:

- Better accepted/rejected order display
- Clear follower names instead of only IDs
- Summary totals: accepted count, rejected count, total notional, total margin
- Input validation feedback
- Better explanation of slippage and leverage risk

### 4. Tests

Add or improve at least one backend test.

The tests should cover trading behaviour, not only basic rendering or API availability.

## Trading knowledge we expect to see

You should understand and apply these ideas:

- **Notional value** = quantity × fill price
- **Margin required** = notional ÷ leverage
- **Slippage** means copied orders may fill at a worse price than the leader trade
- **BUY slippage** increases price; **SELL slippage** decreases price
- Followers may have lower leverage or smaller balances than the leader
- A copy trade must be rejected when it would break follower risk rules
- Exchange step sizes mean quantities must be rounded down, not up

## Deliverables

Submit:

1. Your completed project GitHub URL
2. One screenshot of the completed project's UI
3. A short `NOTES.md` explaining:
   - What you changed
   - Any assumptions you made
   - What you would improve next if this were production

## What we care about

We care more about clear thinking than perfect polish.

A good solution should be safe, readable, tested, and easy to reason about.
