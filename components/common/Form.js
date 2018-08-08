import React from "react";

class Form extends React.Component {
  static Control = ({ label, children, errorText, suffix }) => (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">{children}</div>
      {errorText && <p className="help is-danger">{errorText}</p>}
    </div>
  );

  static Input = ({ isError, suffix, ...inputProps }) => {
    const input = (
      <input
        className={`input ${isError ? "is-danger" : ""}`}
        type="text"
        {...inputProps}
      />
    );

    if (!suffix) return input;
    return (
      <div className="field has-addons">
        <p className="control">
          <a className="button is-static">{suffix}</a>
        </p>
        <p className="control is-expanded">{input}</p>
      </div>
    );
  };

  static Button = ({
    children,
    isSubmitting,
    isError,
    className,
    ...props
  }) => {
    const classNameToInject = ["button", "is-primary"];

    if (isSubmitting) classNameToInject.push("is-loading");

    if (isError) classNameToInject.push("is-danger");

    if (className) classNameToInject.push(className);

    return (
      <button
        {...props}
        disabled={isSubmitting}
        className={classNameToInject.join(" ")}
      >
        {children}
      </button>
    );
  };

  render() {
    const { children, ...props } = this.props;
    return <form {...props}>{children}</form>;
  }
}

export default Form;
