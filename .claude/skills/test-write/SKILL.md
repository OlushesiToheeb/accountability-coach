---
description: Write tests using TDD (Red-Green-Refactor) approach
argument-hint: [module-or-file-to-test]
---

# Test Write — TDD Test Writing

You are a senior engineer writing tests for the Seamless project using a Red-Green-Refactor approach.

## Rules

- **ALWAYS** follow RED-GREEN-REFACTOR cycle
- **ALWAYS** read the source code before writing tests
- **ALWAYS** read COMMON-MISTAKES.md for testing-related pitfalls
- **COLOCATE** test files with source: `{name}.spec.ts`
- **DO NOT** test implementation details — test behavior
- **DO NOT** over-mock — only mock external boundaries

## Test Stack

| Layer | Framework | Location |
|-------|-----------|----------|
| Backend unit tests | Vitest | `backend/src/**/*.spec.ts` |
| Frontend component tests | Vitest + testing-library | `frontend/src/**/*.spec.ts` |
| Frontend hook tests | Vitest + renderHook | `frontend/src/**/*.spec.ts` |

## Process

### Step 1: Understand What to Test

1. Read the target file(s) thoroughly
2. Read relevant CLAUDE.md conventions
3. Read COMMON-MISTAKES.md for testing patterns
4. Identify:
   - Public API (exported functions, methods, components)
   - Critical paths (happy path, error handling)
   - Edge cases (null inputs, empty arrays, boundary values)
   - Integration points (where modules connect)

### Step 2: Plan Test Cases

List all test cases before writing any code:

```markdown
## Test Plan: [module/file]

### Happy Path
- [ ] Test case 1: description
- [ ] Test case 2: description

### Error Handling
- [ ] Test case 3: description

### Edge Cases
- [ ] Test case 4: description
```

Present the test plan to the user for approval.

### Step 3: RED — Write Failing Tests

Write test files that express the expected behavior:

**Backend Service Tests:**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test } from '@nestjs/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MyService,
        { provide: 'DEPENDENCY', useValue: { method: vi.fn() } },
      ],
    }).compile();

    service = module.get(MyService);
  });

  it('should do expected behavior', async () => {
    const result = await service.method(input);
    expect(result).toEqual(expected);
  });
});
```

**Backend Controller Tests:**
```typescript
// Mock services, test HTTP behavior (status codes, validation, auth)
```

**Frontend Component Tests:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  it('renders expected content', () => {
    render(<MyComponent prop="value" />);
    expect(screen.getByText('expected')).toBeInTheDocument();
  });
});
```

**Frontend Hook Tests:**
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMyHook } from './use-my-hook';

describe('useMyHook', () => {
  const wrapper = ({ children }) => (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );

  it('returns expected data', async () => {
    const { result } = renderHook(() => useMyHook(), { wrapper });
    await waitFor(() => expect(result.current.data).toBeDefined());
  });
});
```

### Step 4: GREEN — Verify Tests Fail Correctly

Run the tests to confirm they fail for the right reason:
```bash
cd backend && npx vitest run [test-file]    # backend
cd frontend && npx vitest run [test-file]   # frontend
```

If tests pass when they shouldn't, the test is wrong — fix it.

### Step 5: GREEN — Make Tests Pass

If tests are for existing code, they should already pass. If writing tests alongside new code, implement the minimum code to make tests pass.

### Step 6: REFACTOR — Clean Up

Review the tests for:
- Clarity: Can someone understand the test without reading the source?
- DRY: Extract shared setup into `beforeEach` or helpers
- Coverage: Are critical paths covered?
- Naming: Do test descriptions explain the behavior?

### Step 7: Verify All Tests Pass

```bash
cd backend && npm run test -- --run    # all backend tests
cd frontend && npx vitest run          # all frontend tests
```

### Step 8: Summary

Present results:
- Total tests written
- Coverage of the target module
- Any uncovered edge cases (with rationale for skipping)
