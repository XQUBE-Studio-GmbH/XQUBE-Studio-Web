export default function AdminStyles() {
  return (
    <style>{`
      div:has(> input#field-password),
      div:has(> input#field-confirm-password) {
        display: none !important;
      }
      label[for="field-password"],
      label[for="field-confirm-password"] {
        display: none !important;
      }
    `}</style>
  )
}
