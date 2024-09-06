export function FormHint({ hint }: { hint: string }) {
  return (
    <tr>
      <td></td>
      <td>
        <p className="hint">{hint}</p>
      </td>
    </tr>
  );
}
