import { Text, TextInput, ScrollView } from "react-native";
import { BackButton } from "../components/BackButton";

export function New() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-background px-8 pt-16"
    >
      <BackButton />

      <Text className="mt-6 text-white font-extrabold text-3xl">
        Criar Hábito
      </Text>

      <Text className="mt-6 text-white font-semibold text-base">
        Qual seu comprometimento?
      </Text>

      <TextInput className="h-12 pl-4 rounded-lg mt-3 bg-zinc-800 text-white focus:border-2 border-green-600" />
    </ScrollView>
  );
}
