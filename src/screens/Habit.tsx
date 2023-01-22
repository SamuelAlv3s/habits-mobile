import { Text, View, ScrollView, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/CheckBox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

interface Params {
  date: string;
}

interface DayInfo {
  possibleHabits: {
    id: string;
    title: string;
  }[];
  completedHabits: string[];
}

export function Habit() {
  const [loading, setLoading] = useState<boolean>(true);
  const [dayInfo, setDayInfo] = useState<DayInfo | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo?.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  async function fetchHabits() {
    try {
      setLoading(true);
      const response = await api.get("/day", {
        params: { date },
      });
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`);
      if (completedHabits.includes(habitId)) {
        setCompletedHabits(completedHabits.filter((id) => id !== habitId));
      } else {
        setCompletedHabits([...completedHabits, habitId]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao atualizar hábito");
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) return <Loading />;

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-600 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            ["opacity-50"]: isDateInPast,
          })}
        >
          {dayInfo?.possibleHabits.length ? (
            dayInfo?.possibleHabits.map((habit) => {
              return (
                <Checkbox
                  key={habit.id}
                  title={habit.title}
                  isChecked={completedHabits.includes(habit.id)}
                  onPress={() => handleToggleHabit(habit.id)}
                  disabled={isDateInPast}
                />
              );
            })
          ) : (
            <HabitsEmpty />
          )}
        </View>

        {isDateInPast && (
          <Text className="text-white mt-10 text-center">
            Você não pode mais marcar ou desmarcar hábitos de um dia que já
            passou.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
