import React from "react";

const Notification = ({ children, type = "warning" }) => (
  <article className={`message is-${type}`}>
    <div className="message-body">{children}</div>
  </article>
);

export default Notification;
