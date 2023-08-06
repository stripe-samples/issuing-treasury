import { Slide, Stack, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import Image from "next/image";
import { useEffect, useState } from "react";
import Stripe from "stripe";

const brandIcon: Record<string, string> = {
  Mastercard: "/assets/logos/logo-mastercard.svg",
  VISA: "/assets/logos/logo-visa.svg",
};

const CardIllustration = ({
  cardId,
  card,
  brand,
  accountId,
}: {
  cardId: string;
  card: Stripe.Issuing.Card;
  brand: string;
  accountId: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const theme = useTheme();
  const [issuingElementsMounted, setIssuingElementsMounted] = useState(false);

  useEffect(
    () => {
      if (!stripe || !elements || card.type === "physical") {
        return;
      }

      const renderCard = async () => {
        const elementsStyle = {
          base: {
            color: "white",
            fontFamily: theme.typography.fontFamily,
            fontSize: "16px",
            fontWeight: 700,
          },
        };

        const nonceResult = await stripe.createEphemeralKeyNonce({
          issuingCard: cardId,
        });

        const ephemeralKeyResult = await fetch("/api/get_card", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cardId: cardId,
            nonce: nonceResult.nonce,
            accountId: accountId,
          }),
        });

        const ephemeralKeyResponse = await ephemeralKeyResult.json();

        // Populate the raw card details
        const cardNumberStyle = {
          base: {
            ...elementsStyle.base,
            ...{
              fontSize: "24px",
              letterSpacing: "0.1em",
              backgroundClip: "text",
              textFillColor: "transparent",
            },
          },
        };
        elements
          .create("issuingCardNumberDisplay", {
            issuingCard: cardId,
            ephemeralKeySecret: ephemeralKeyResponse.secret,
            nonce: nonceResult.nonce,
            style: cardNumberStyle,
          })
          .mount("#card-number");

        elements
          .create("issuingCardExpiryDisplay", {
            issuingCard: cardId,
            ephemeralKeySecret: ephemeralKeyResponse.secret,
            nonce: nonceResult.nonce,
            style: elementsStyle,
          })
          .mount("#card-expiry");

        elements
          .create("issuingCardCvcDisplay", {
            issuingCard: cardId,
            ephemeralKeySecret: ephemeralKeyResponse.secret,
            nonce: nonceResult.nonce,
            style: elementsStyle,
          })
          .mount("#card-cvc");
      };

      setIssuingElementsMounted(true);

      renderCard();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stripe, elements],
  );

  return (
    <Slide direction="down" in={issuingElementsMounted} mountOnEnter>
      <Box
        sx={{
          borderRadius: 2,
          boxShadow: 12,
          backgroundColor: "primary.main",
          backgroundImage: `url("/assets/cards/card-background.png")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          py: 6,
          px: 4,
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Image
            src="/assets/cards/contactless.svg"
            alt="Contactless Card Logo"
            height={38}
            width={29}
          />
          <Image
            alt="Card Network Logo"
            src={brandIcon[brand]}
            width={102}
            height={32}
          />
        </Stack>
        {/*
          Setting the height of 30px for the card number element so that the card doesn't get resized when the element
          info is being mounted.
        */}
        <Box sx={{ mt: 6, mb: 3, height: 30 }}>
          <Typography id="card-number"></Typography>
        </Box>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography color="white" variant="body2">
              Cardholder name
            </Typography>
            <Typography
              color="white"
              mt={1}
              sx={{
                fontSize: 16,
                fontWeight: 700,
                lineHeight: "24px",
              }}
            >
              {card.cardholder.name}
            </Typography>
          </Box>
          <Box>
            <Typography color="white" variant="body2">
              Expiry date
            </Typography>
            <Typography color="white" mt={1} id="card-expiry"></Typography>
          </Box>
          <Box>
            <Typography color="white" variant="body2">
              CVC
            </Typography>
            <Typography color="white" mt={1} id="card-cvc"></Typography>
          </Box>
          <Box>
            <Image
              src="/assets/cards/sim.svg"
              alt="SIM Logo"
              height={45}
              width={58}
            />
          </Box>
        </Stack>
      </Box>
    </Slide>
  );
};

export default CardIllustration;
