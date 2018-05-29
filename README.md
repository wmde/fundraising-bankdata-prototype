# Description
Prototype for bank data part of the fundraising frontend.  

IBAN cases:
- If the first two characters are letters, the label of the field below changes from "BIC/Bankleitzahl" to "BIC".
- If the first two characters are "DE", the BIC field below is set to read-only.
- When the server responds with a BIC, it is set in the respective field.

Account number case:
- If the first two characters are digits, the label of the field below changes from "BIC/Bankleitzahl" to "Bankleitzahl".
