import { View, Text, TextInput, ScrollView } from "react-native";
import React, { useContext } from "react";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
//components
import Button from "../Button";

// style
import useStyles from "../../utils/DefaultStyles";
import { updateNoteById } from "../../services/noteApi";
import { LoginContext, NoteContext } from "../../utils/context";

const UpdateNote = () => {
  const styles = useStyles();
  const navigation = useNavigation();

  const { currentNote, setAllNotes, reloadNote, setReloadNote } =
    useContext(NoteContext);
  const { userName } = useContext(LoginContext);

  const formatTag = (tags: string[]) => {
    if (tags) tags.toString().replaceAll(",", " ");
  };

  const noteValidationSchema = yup.object().shape({
    title: yup.string().required("Vous devez saisir un titre"),
    text: yup.string().required("Vous devez saisir un texte de note"),
  });

  const sendData = async (body: any) => {
    const tagsArray = body.tags.split(" ");
    const data = {
      title: body.title,
      text: body.text,
      author: userName,
      anonym: true,
      tags: tagsArray,
    };
    updateNoteById(currentNote?._id, data);
    setReloadNote(!reloadNote);
    navigation.navigate("NewNoteScreen");
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.createNoteContainer}>
        <Formik
          validationSchema={noteValidationSchema}
          initialValues={{
            title: currentNote?.title,
            tags: currentNote?.tags?.toString().replace(/,/g, " "),
            text: currentNote?.text,
          }}
          onSubmit={(body: any) => sendData(body)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <>
              <Text style={styles.label}>Titre</Text>
              <TextInput
                value={values.title}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                style={styles.input}
                placeholder="Titre de votre note"
                placeholderTextColor="#909090"
              />
              {touched.title && errors.title && (
                <Text style={{ fontSize: 12, color: "#FF0000" }}>
                  {errors.title}
                </Text>
              )}
              <Text style={styles.label}>Mot(s) clé(s)</Text>
              <TextInput
                value={values.tags}
                onChangeText={handleChange("tags")}
                onBlur={handleBlur("tags")}
                style={styles.input}
                placeholder="Mots clés de votre note"
                placeholderTextColor="#909090"
              />
              {touched.tags && errors.tags && (
                <Text style={{ fontSize: 12, color: "#FF0000" }}>
                  {errors.tags}
                </Text>
              )}
              <Text style={styles.label}>Message de votre note</Text>
              <TextInput
                value={values.text}
                onChangeText={handleChange("text")}
                onBlur={handleBlur("text")}
                style={styles.inputText}
                multiline={true}
                placeholder="Rédiger ma note"
                placeholderTextColor="#909090"
              />
              {touched.text && errors.text && (
                <Text style={{ fontSize: 12, color: "#FF0000" }}>
                  {errors.text}
                </Text>
              )}
              <Button onPress={handleSubmit} disabled={!isValid}>
                Mettre à jour ma note
              </Button>
            </>
          )}
        </Formik>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default UpdateNote;
