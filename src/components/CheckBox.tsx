import {
  TouchableOpacity,
  View,
  Text,
  TouchableOpacityProps,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

interface CheckBoxProps extends TouchableOpacityProps {
  title: string;
  isChecked?: boolean;
}

export function Checkbox({ title, isChecked, ...rest }: CheckBoxProps) {
  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.7}
      className="flex-row mb-2 items-center"
    >
      {isChecked ? (
        <View className="w-8 h-8 bg-green-500 rounded-lg items-center justify-center">
          <Feather name="check" size={20} color={colors.white} />
        </View>
      ) : (
        <View className="w-8 h-8 bg-zinc-900 rounded-lg" />
      )}

      <Text className="text-white ml-3">{title}</Text>
    </TouchableOpacity>
  );
}
