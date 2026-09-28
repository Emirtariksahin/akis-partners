import { notFound } from "next/navigation";

// Birden fazla root layout kullanıldığı için (site ve Keystatic), eşleşmeyen adresler
// bu catch-all ile site layout'u içindeki not-found sayfasına yönlendirilir.
export default function Bulunamadi() {
  notFound();
}
