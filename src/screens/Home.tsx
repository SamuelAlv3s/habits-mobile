import { Text, View, ScrollView, Alert } from "react-native";
import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const datesFromYearStart = generateRangeDatesFromYearStart();

const minimumSummaryDatesSizes = 18 * 5;
const amountOfDatesToFill =
  minimumSummaryDatesSizes - datesFromYearStart.length;

type Summary = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>;
export function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<Summary>([]);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get("/summary");
      setSummary(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const { navigate } = useNavigation();

  if (loading) return <Loading />;
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekday, i) => (
          <Text
            key={`${weekday}-${i}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
          >
            {weekday}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {datesFromYearStart.map((date) => {
              const dayWithHabits = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });
              return (
                <HabitDay
                  date={date}
                  amountOfHabits={dayWithHabits?.amount}
                  amountOfHabitsCompleted={dayWithHabits?.completed}
                  onPress={() => navigate("habit", { date: date.toString() })}
                  key={date.toString()}
                />
              );
            })}

            {amountOfDatesToFill > 0 &&
              Array.from({ length: amountOfDatesToFill }).map((_, i) => (
                <View
                  key={i}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                ></View>
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
