import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      src="/assets/llama_party_hat_transparent_MG.png"
      alt="Llama Llama Credit Logo"
      width={40}
      height={40}
      style={{
        objectFit: "contain",
      }}
    />
  );
};
