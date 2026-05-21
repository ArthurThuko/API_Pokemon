import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

type Pokemon = {
  name: string;
  image: string;
};

type PokemonListItem = {
  name: string;
  url: string;
};

export default function App() {
  const [search, setSearch] = useState("");
  const [allPokemons, setAllPokemons] = useState<PokemonListItem[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega todos os Pokémon uma única vez
  useEffect(() => {
    async function loadPokemons() {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1000"
        );

        const data = await response.json();

        setAllPokemons(data.results);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    loadPokemons();
  }, []);

  // Filtra enquanto digita
  useEffect(() => {
    if (!search.trim()) {
      setFilteredPokemons([]);
      return;
    }

    // não permite números
    if (!isNaN(Number(search))) {
      setFilteredPokemons([]);
      return;
    }

    const filtered = allPokemons
      .filter((pokemon) =>
        pokemon.name.startsWith(
          search.toLowerCase()
        )
      )
      .slice(0, 20)
      .map((pokemon) => {
        const id = pokemon.url
          .split("/")
          .filter(Boolean)
          .pop();

        return {
          name: pokemon.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      });

    setFilteredPokemons(filtered);
  }, [search]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>
        Pokédex
      </Text>

      <TextInput
        placeholder="Digite o nome..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
        placeholderTextColor="#777"
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={filteredPokemons}
          keyExtractor={(item) => item.name}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />

              <Text style={styles.name}>
                {item.name}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F8FF",
    padding: 20,
    paddingTop: 60,
  },

  title: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0077FF",
    marginBottom: 25,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#00C896",
    borderRadius: 15,
    height: 55,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  image: {
    width: 80,
    height: 80,
  },

  name: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: "#00A86B",
  },
});