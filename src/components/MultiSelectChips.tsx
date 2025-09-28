import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SelectChips<T extends string>({
    options,
    selected,
    onChange,
    anyText = "Any",
    suffix = ""
}: {
    options: T[];
    selected: T[] | T | undefined;
    onChange: (selected: T[] | T | undefined) => void;
    anyText?: string;
    suffix?: string;
}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={(Array.isArray(selected) && selected.length === 0 || selected === undefined) ? styles.buttonActive : styles.buttonInactive}
                onPress={() => onChange(undefined)}>
                <Text>{anyText}</Text>
            </TouchableOpacity>
            {options.map(option => {
                const isSelected = selected && (Array.isArray(selected) ? selected.includes(option) : selected === option);
                return (
                    <TouchableOpacity
                        key={option}
                        style={isSelected ? styles.buttonActive : styles.buttonInactive}
                        onPress={() => {
                            if (isSelected) {
                                if (!Array.isArray(selected)) {
                                    onChange(undefined);
                                    return;
                                }
                                onChange(selected.filter(item => item !== option));
                            } else {
                                if (!Array.isArray(selected)) {
                                    onChange(option);
                                    return;
                                }
                                onChange([...selected, option]);
                            }
                        }}
                    >
                        <Text>{option} {suffix}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    buttonInactive: {
        display: 'flex',
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    buttonActive: {
        borderColor: "#00a6db",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10
    }
});