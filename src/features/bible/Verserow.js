import React, { useRef, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText } from '../../components/AppText';
import { ASH } from './Constants';
import { cleanVerseText } from './Utils';

const DOUBLE_TAP_DELAY = 250;

const VerseRow = ({
  v,
  onSingleTap,
  onDoubleTap,
  onLayout,

  isSelected,
  isNavHighlight,
  isHighlighted,
  isUnderlined,
  hasNote,
  isSaved,

  fontSizeScale,
  dynamicLineHeight,
  dynamicVerseSpacing,

  highlightColor,
}) => {

  const lastTapRef = useRef(null);
  const singleTapTimeoutRef = useRef(null);


  const handlePress = () => {

    const now = Date.now();


    if (
      lastTapRef.current &&
      now - lastTapRef.current < DOUBLE_TAP_DELAY
    ) {

      if (singleTapTimeoutRef.current) {
        clearTimeout(singleTapTimeoutRef.current);
      }

      lastTapRef.current = null;

      onDoubleTap?.(v);

      return;
    }


    lastTapRef.current = now;


    singleTapTimeoutRef.current = setTimeout(() => {

      lastTapRef.current = null;

      onSingleTap?.(v);

    }, DOUBLE_TAP_DELAY);

  };



  useEffect(() => {

    return () => {

      if (singleTapTimeoutRef.current) {
        clearTimeout(singleTapTimeoutRef.current);
      }

    };

  }, []);



  return (

    <Pressable

      onPress={handlePress}

      onLayout={onLayout}

      android_ripple={null}

      style={[

        styles.verseLineBlockWrapper,


        // temporary chapter/verse navigation highlight
        isNavHighlight &&
        styles.navigationHighlight,


        // selection highlight from action sheet range
        isSelected &&
        styles.selectionHighlight,


        // permanent color highlight fallback
        isHighlighted &&
        !highlightColor &&
        styles.savedHighlight,


        {
          marginBottom: dynamicVerseSpacing,
        },


        highlightColor && {
          backgroundColor: highlightColor,
        },

      ]}

    >



      <AppText

        style={[

          styles.miniVerseSuperscriptIndex,

          {
            fontSize: Math.max(10, fontSizeScale - 6),
          },

        ]}

      >

        {v.verse}

      </AppText>



      <View style={styles.verseTextContainer}>


        <AppText

          style={[

            styles.coreReadingVerseString,


            {
              fontSize: fontSizeScale,
              lineHeight: dynamicLineHeight,
            },


            // underline only comes from parent state
            isUnderlined && styles.underlinedVerse,


          ]}

        >

          {cleanVerseText(v.text)}

        </AppText>



        {
          (hasNote || isSaved) && (

            <View style={styles.indicatorPillContainer}>


              {
                isSaved && (

                  <View
                    style={[
                      styles.indicatorPill,
                      styles.savedPill,
                    ]}
                  >

                    <AppText style={styles.indicatorPillText}>
                      Saved
                    </AppText>

                  </View>

                )
              }



              {
                hasNote && (

                  <View
                    style={[
                      styles.indicatorPill,
                      styles.notePill,
                    ]}
                  >

                    <AppText style={styles.indicatorPillText}>
                      Note
                    </AppText>

                  </View>

                )
              }


            </View>

          )
        }


      </View>


    </Pressable>

  );

};



const styles = StyleSheet.create({

  verseLineBlockWrapper:{
    flexDirection:'row',
    alignItems:'flex-start',
    paddingVertical:6,
    paddingHorizontal:8,
    borderRadius:10,
  },


  navigationHighlight:{
    backgroundColor:'rgba(53,42,72,0.16)',
    borderRadius:10,
  },


  selectionHighlight:{
    backgroundColor:'rgba(53,42,72,0.10)',
    borderRadius:10,
  },


  savedHighlight:{
    backgroundColor:ASH.highlightFill,
    borderRadius:10,
  },


  miniVerseSuperscriptIndex:{
    width:28,
    minWidth:28,
    color:'#352a48',
    fontWeight:'700',
    opacity:0.45,
    marginTop:1,
    flexShrink:0,
  },


  verseTextContainer:{
    flex:1,
    paddingLeft:6,
  },


  coreReadingVerseString:{
    color:'#09090b',
    textAlign:'left',
    fontWeight:'400',
  },


  underlinedVerse:{
    textDecorationLine:'underline',
    textDecorationColor:'#352a48',
    textDecorationStyle:'solid',
  },


  indicatorPillContainer:{
    flexDirection:'row',
    gap:6,
    marginTop:4,
  },


  indicatorPill:{
    paddingHorizontal:6,
    paddingVertical:2,
    borderRadius:4,
  },


  savedPill:{
    backgroundColor:'#ef4444',
  },


  notePill:{
    backgroundColor:'#352a48',
  },


  indicatorPillText:{
    fontSize:9,
    color:'#ffffff',
    fontWeight:'700',
  },

});


export default VerseRow;