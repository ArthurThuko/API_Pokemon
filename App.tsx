import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
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

export default function App() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      searchPokemon();
    }, 500);

    return () => clearTimeout(delay);
  }, [pokemonName]);

  async function searchPokemon() {
    if (!pokemonName.trim()) {
      setPokemon(null);
      return;
    }

    // bloqueia números
    if (!isNaN(Number(pokemonName))) {
      setPokemon(null);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );

      if (!response.ok) {
        setPokemon(null);
        return;
      }

      const data = await response.json();

      setPokemon({
        name: data.name,
        image: data.sprites.front_default,
      });
    } catch {
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>Pokédex</Text>

      <TextInput
        placeholder="Digite o nome do Pokémon..."
        value={pokemonName}
        onChangeText={setPokemonName}
        style={styles.input}
        placeholderTextColor="#777"
      />

      {loading && (
        <ActivityIndicator
          size="large"
          style={{ marginTop: 30 }}
        />
      )}

      {!loading && pokemon && (
        <View style={styles.card}>
          <Image
            source={{ uri: pokemon.image }}
            style={styles.image}
          />

          <Text style={styles.name}>
            {pokemon.name}
          </Text>
        </View>
      )}

      {!loading &&
        pokemonName !== "" &&
        !pokemon && (
          <Text style={styles.notFound}>
            Pokémon não encontrado
          </Text>
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
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0077FF",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#fff",
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "#00C896",
    fontSize: 16,
  },

  card: {
    marginTop: 40,
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },

  image: {
    width: 180,
    height: 180,
  },

  name: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: "#00A86B",
  },

  notFound: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 18,
    color: "red",
  },
});