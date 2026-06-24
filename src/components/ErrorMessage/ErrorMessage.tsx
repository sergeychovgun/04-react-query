import css from "./ErrorMessage.module.css";

export default function ErrorMessage() {
  return (
    <div className={css.wrapper}>
      <p className={css.text}>
        Something went wrong. Please try again later.
      </p>
    </div>
  );
}
