import { FormControlLabel, Link, Switch } from "@mui/material";

export const EmbeddedComponentsSwitcher = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <FormControlLabel
      control={<Switch checked={value} onChange={onChange} />}
      label={
        <>
          Use{" "}
          <Link
            href="https://docs.stripe.com/connect/get-started-connect-embedded-components"
            target="_blank"
          >
            embedded components
          </Link>
        </>
      }
    />
  );
};
