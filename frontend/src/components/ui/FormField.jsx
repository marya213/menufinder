const FormField = ({ label, children }) => {
  return (
    <label className="ui-form-field">
      <span>{label}</span>
      {children}
    </label>
  );
};

export default FormField;

