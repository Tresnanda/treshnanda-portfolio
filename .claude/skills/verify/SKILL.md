---
name: verify
description: Launch and drive the portfolio in headless Chrome for replayable UI verification.
---

# Portfolio verification

1. Start a clean server on an unused port: `pnpm exec next dev -p <port> > /tmp/treshnanda-portfolio-verify.log 2>&1`.
2. Wait for `curl -fsS http://127.0.0.1:<port>` to succeed.
3. Start macOS Chrome headless with a fresh profile, remote debugging, SwiftShader, and `--host-resolver-rules="MAP localhost 127.0.0.1"`.
4. Drive `http://localhost:<port>` through CDP using Node's built-in `WebSocket`:
   - capture the loader and hero;
   - inspect the desktop Works canvas;
   - verify mobile editorial rows and no horizontal overflow;
   - open a project modal, confirm close-button focus, Tab containment, Escape close, background inertness, and focus restoration;
   - emulate `prefers-reduced-motion: reduce` and confirm flat rows, no 3D canvas, stopped stack animation, and automatic scroll behavior.
5. Read screenshots and the clean dev log. Hydration errors, runtime overlays, or uncaught browser errors fail verification.

Use an IPv4 host mapping because another local service may bind `localhost` over IPv6 on the same numeric port.
