import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ImageBackground
} from 'react-native';

const Background = ({ children }) => (
  <ImageBackground
    source={require('./assets/background.png')}
    style={styles.backgroundImage}
    resizeMode="cover"
  >
    {children}
  </ImageBackground>
);

export default function App() {
  const [lotteryNumber, setLotteryNumber] = useState(generateRandomNumber());
  const [guess, setGuess] = useState('');
  const [bet, setBet] = useState(1);
  const [multiplierEnabled, setMultiplierEnabled] = useState(false);
  const [multiplier, setMultiplier] = useState(2);
  const [resultMessage, setResultMessage] = useState('');
  const [showLotteryNumber, setShowLotteryNumber] = useState(false);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  const onSubmitGuess = () => {
    const guessNumber = parseInt(guess);
    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 10000) {
      Alert.alert('Invalid input', 'Please enter a number between 1 and 10000.');
      return;
    }
    setShowLotteryNumber(true);
    if (guessNumber === lotteryNumber) {
      const winMultiplier = multiplierEnabled ? multiplier : 1;
      const winnings = bet * 10 * winMultiplier;
      setResultMessage(`🎉 You won! Your winnings: ${winnings} points!`);
    } else {
      setResultMessage(
        guessNumber < lotteryNumber
          ? '❌ Your guess is too low!'
          : '❌ Your guess is too high!'
      );
    }
  };

  const onNextRound = () => {
    setLotteryNumber(generateRandomNumber());
    setGuess('');
    setResultMessage('');
    setShowLotteryNumber(false);
    setMultiplierEnabled(false);
    setMultiplier(2);
    setBet(1);
  };

  const increaseBet = () => {
    setBet((prev) => (prev < 100 ? prev + 1 : prev));
  };

  const decreaseBet = () => {
    setBet((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const increaseMultiplier = () => {
    setMultiplier((prev) => (prev < 10 ? prev + 1 : prev));
  };

  const decreaseMultiplier = () => {
    setMultiplier((prev) => (prev > 2 ? prev - 1 : prev));
  };

  const getResultColor = () => {
    if (resultMessage.includes('won')) {
      return '#FFD700';
    }
    if (resultMessage) {
      return '#FF4C4C';
    }
    return '#FFFFFF';
  };

  return (
    <Background>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Change the title below to customize the app's main heading */}
        <Text style={styles.title}>LOTTERY</Text>
        <Text style={[styles.subtitle, { color: getResultColor() }]}>
          {resultMessage}
        </Text>

        <View style={styles.lotteryNumberContainer}>
          <Text style={styles.lotteryNumberLabel}>Lottery Result:</Text>
          <Text
            style={[
              styles.lotteryNumber,
              showLotteryNumber && resultMessage.includes('won')
                ? { color: '#FFD700', borderColor: '#FFD700' }
                : showLotteryNumber && resultMessage
                ? { color: '#FF4C4C', borderColor: '#FF4C4C' }
                : { color: '#FFFFFF', borderColor: '#FFFFFF' }
            ]}
          >
            {showLotteryNumber ? lotteryNumber : '???'}
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter your guess (1-10000)"
          placeholderTextColor="#b0b0b0"
          keyboardType="numeric"
          maxLength={5}
          value={guess}
          onChangeText={setGuess}
          editable={!resultMessage}
        />

        <View style={styles.betContainer}>
          <TouchableOpacity
            style={styles.betButton}
            onPress={decreaseBet}
            disabled={!!resultMessage}
          >
            <Text style={styles.betButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.betText}>Bet: {bet}</Text>
          <TouchableOpacity
            style={styles.betButton}
            onPress={increaseBet}
            disabled={!!resultMessage}
          >
            <Text style={styles.betButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {resultMessage.includes('won') && (
          <View style={styles.multiplierContainer}>
            <Text style={styles.multiplierLabel}>Multiplier</Text>
            <Switch
              value={multiplierEnabled}
              onValueChange={setMultiplierEnabled}
              trackColor={{ false: '#767577', true: '#FFD700' }}
              thumbColor={multiplierEnabled ? '#fff' : '#fff'}
            />
            {multiplierEnabled && (
              <View style={styles.multiplierControls}>
                <TouchableOpacity
                  style={styles.multiplierButton}
                  onPress={decreaseMultiplier}
                >
                  <Text style={styles.multiplierButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.multiplierValue}>{multiplier}x</Text>
                <TouchableOpacity
                  style={styles.multiplierButton}
                  onPress={increaseMultiplier}
                >
                  <Text style={styles.multiplierButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {!resultMessage ? (
          <TouchableOpacity style={styles.submitButton} onPress={onSubmitGuess}>
            <Text style={styles.submitButtonText}>Submit Guess</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={onNextRound}>
            <Text style={styles.nextButtonText}>Next Round</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </Background>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFD700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 30,
    minHeight: 24,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#FFFFFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  lotteryNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  lotteryNumberLabel: {
    fontSize: 22,
    marginRight: 10,
    color: '#7fb4fa',
    fontFamily: Platform.OS === 'ios' ? 'Arial-BoldMT' : 'sans-serif',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  lotteryNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 0,
    minWidth: 100,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Arial Black' : 'sans-serif',
    backgroundColor: 'rgba(0,0,0,0.35)',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  input: {
    borderWidth: 2,
    borderColor: '#7fb4fa',
    borderRadius: 0,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 20,
    width: '80%',
    marginBottom: 40,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    backgroundColor: 'rgba(44,44,44,0.6)',
  },
  betContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  betButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 0,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#7fb4fa',
  },
  betButtonText: {
    fontSize: 28,
    color: '#0758c1',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Arial-BoldMT' : 'sans-serif',
  },
  betText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  submitButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 0,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  submitButtonText: {
    fontSize: 22,
    color: '#222',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    letterSpacing: 1,
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 0,
    marginTop: 10,
  },
  nextButtonText: {
    fontSize: 22,
    color: '#0758c1',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Arial-BoldMT' : 'sans-serif',
  },
  multiplierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  multiplierLabel: {
    fontSize: 20,
    marginRight: 10,
    color: '#7fb4fa',
    fontFamily: Platform.OS === 'ios' ? 'Arial-BoldMT' : 'sans-serif',
  },
  multiplierControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  multiplierButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 0,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#7fb4fa',
  },
  multiplierButtonText: {
    fontSize: 20,
    color: '#0758c1',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Arial-BoldMT' : 'sans-serif',
  },
  multiplierValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    minWidth: 40,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
