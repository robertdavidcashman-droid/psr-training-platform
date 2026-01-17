# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: Create an account
      - generic [ref=e7]: Start training with Duolingo-style practice
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: Name
        - textbox "Name" [ref=e12]: Test User
      - generic [ref=e13]:
        - generic [ref=e14]: Email
        - textbox "Email" [ref=e15]: test-1768678251816@example.com
      - generic [ref=e16]:
        - generic [ref=e17]: Password
        - textbox "Password" [ref=e18]: TestPassword123!
        - paragraph [ref=e19]: Minimum 8 characters.
      - button "Creating…" [disabled]
      - link "Already have an account? Log in" [ref=e21] [cursor=pointer]:
        - /url: /login
  - generic [ref=e25]:
    - strong [ref=e26]: "DEV: Session Debug"
    - text: "| Not authenticated"
  - button "Open Next.js Dev Tools" [ref=e32] [cursor=pointer]:
    - img [ref=e33]
  - alert [ref=e36]
```